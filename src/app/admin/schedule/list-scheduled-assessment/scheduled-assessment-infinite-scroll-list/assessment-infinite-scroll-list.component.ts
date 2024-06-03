import { AssesmentsUtil } from './../../../assessments/assessments.common.utils';
import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { CandidatesAssessmentResponseModel } from 'src/app/rest-api/schedule-api/models/candidates-assessment-response.model';
import {
  MetaDataModel,
  ScheduledAssessmentModel
} from 'src/app/rest-api/schedule-api/models/scheduled-assessments-response.model';
import { SchedulerReducerState, FilterValueModel } from '../../redux/schedule.model';
import {
  loadMoreScheduledAssessment,
  getCandidatesAssessments,
  clearCandidatesAssessmentExportData,
  getScheduledAssessment
} from '../../redux/schedule.actions';
import { Store } from '@ngrx/store';
import { selectCandidatesAssessment, selectScheduledAssessMentsState } from '../../redux/schedule.reducers';
import { ScheduleModuleEnum } from '../../schedule.enums';
import { ScheduleUtils } from '../../schedule.utils';
import { selectUserProfileData } from 'src/app/redux/user/user.reducer';
import { SentData } from 'src/app/rest-api/sendData';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CandidateSheduleComponent } from '../../candidate-shedule-common/candidate-shedule.component';
import { CandidateViewComponent } from '../../candidate-shedule-common/candidate-view/candidate-view.component';
import { CandidateSendEmailComponent } from '../../candidate-shedule-common/candidate-send-email/candidate-send-email.component';
import { CandidateSyncDetailsComponent } from '../../candidate-shedule-common/candidateSyncDetails/candidateSyncDetails.component';
import { environment } from '../../../../../../src/environments/environment';

import { DatePipe } from '@angular/common';
import { ScheduleAPIService } from 'src/app/rest-api/schedule-api/schedule-api.service';
import { ToastrService } from 'ngx-toastr';
import { WebSocketService } from 'src/app/rest-api/web-socket/web-socket.service'
import { io } from 'socket.io-client';
import { UserAPIService } from 'src/app/rest-api/user-api/user-api.service';

const socket = io(environment.NODE_URL);


@Component({
  selector: 'app-scheduled-infinite-scroll-list',
  templateUrl: 'assessment-infinite-scroll-list.component.html',
  styleUrls: ['assessment-infinite-scroll-list.component.scss']
})
export class ScheduledInfiniteScrollListComponent implements OnInit {
  @Input() scheduledTemplates: ScheduledAssessmentModel[];
  @Input() pageMetadata: MetaDataModel;
  @Input() searchString: string;
  @Input() status: string;
  @Input() orgId: any;
  @Input() startDateTime: any;
  @Input() endDateTime: any;
  @Input() showLazyLoading: boolean;
  @Input() selectedIndex: number;
  @Input() deliveryStatus: any;
  @Input() assessmentFlow: any;
  @Output() selectedIndexEvent = new EventEmitter<number>();
  @ViewChild('syncDetails', { static: false }) syncDetails: TemplateRef<any>;

  isNotificationDisabled: boolean = true;
  candidateAssessmentSearchString: string;
  public scheduleId: any;
  selector = '.main-panel-schedule-assessment';
  selectedbatchId: string;
  progressBarvalue: any;
  selectedbatchName: string;
  canViewSchedule = false;
  delivaryProgressBar: any = false;
  filterValues: FilterValueModel[] = [
    { value: '', viewValue: ScheduleModuleEnum.AllCandidateInviteStatus },
    {
      value: ScheduleModuleEnum.DeliveredCandidateInviteStatus,
      viewValue: ScheduleModuleEnum.DeliveredCandidateInviteStatus
    },
    {
      value: ScheduleModuleEnum.FailedCandidateInviteStatus,
      viewValue: ScheduleModuleEnum.FailedCandidateInviteStatus
    }
  ];
  selectedFilterValue: string = this.filterValues[0].value;
  selectedDateValue: string = this.filterValues[0].value;
  candidatesAssessment: CandidatesAssessmentResponseModel;
  candidateInfo: any;
  constructor(
    private store: Store<SchedulerReducerState>,
    private router: Router,
    private sendData: SentData,
    public shedule: ScheduleAPIService,
    public websocket: WebSocketService,
    private toaster: ToastrService,
    public scheduleUtil: ScheduleUtils,
    public assesmentsUtil: AssesmentsUtil,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private api: UserAPIService,

  ) { }
  ngOnInit(): void {
    this.socketProgres();
    this.checkScheduleAccessStatus();
    this.store.select(selectCandidatesAssessment).subscribe((val) => {
      this.candidatesAssessment = val;
    });
    sessionStorage.removeItem('candidateStatus');
  }

  onScroll(): void {
    if (this.pageMetadata.nextOffset) {
      // let metaval = JSON.parse(JSON.stringify(this.pageMetadata));
      // metaval.offset = metaval.nextOffset;
      // console.log(this.pageMetadata.totalRecordCount)
      // if(this.pageMetadata.totalRecordCount>30) {
      this.store.dispatch(
        loadMoreScheduledAssessment({
          payload: {
            pageMetaData: this.pageMetadata,
            searchString: this.searchString ? this.searchString : '',
            status: this.status ? this.status : '',
            orgId: this.orgId ? this.orgId : sessionStorage.getItem('orgId'),
            endDateTime: this.endDateTime ? this.endDateTime : '',
            startDateTime: this.startDateTime ? this.startDateTime : '',
            deliveryStatus: this.deliveryStatus ? this.deliveryStatus : '',
            assessmentFlow: this.assessmentFlow ? this.assessmentFlow : ''
          }
        })
      );
      // }
    }
  }
  onHideDeatils(): void {
    this.selectedIndexEvent.emit(-1);
    this.store.dispatch(clearCandidatesAssessmentExportData());
  }
  onViewDeatils(index: number): void {
    this.selectedbatchId = this.scheduledTemplates[index]?.id;
    this.selectedbatchName = this.scheduledTemplates[index]?.attributes.batchName;

    this.store.dispatch(
      getCandidatesAssessments({
        payload: {
          pageMetaData: {
            limit: 5,
            nextOffset: 0,
            offset: 0
          },
          searchString: '',
          status: '',
          orgId: this.orgId ? this.orgId : sessionStorage.getItem('orgId'),
          batchId: this.selectedbatchId
        }
      })
    );
    this.selectedIndexEvent.emit(index);
    this.store.dispatch(clearCandidatesAssessmentExportData());
  }

  onEditDeatils(index, assessments) {
    this.router.navigate(['/admin/schedule/edit'], { state: { data: assessments } });
    // this.sendData.sendMessage(assessments);
  }

  checkScheduleAccessStatus(): void {
    this.store.select(selectUserProfileData).subscribe((profileResponse) => {
      profileResponse.attributes.organisations.forEach((organisations) => {
        organisations.roles.forEach((roles) => {
          roles.permissions.forEach((permissions) => {
            if (permissions.code === 'VSH') {
              this.canViewSchedule = true;
            }
          });
        });
      });
    });
  }
  openEmailDialog(data) {
    this.dialog.open(CandidateSendEmailComponent, {
      panelClass: 'my-custom-dialog-class',
      width: '600px',
      height: '550px',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      data: data
    });
  }
  onViewDialog(data: any) {
    this.dialog.open(CandidateViewComponent, {
      panelClass: 'my-custom-dialog-class',
      width: '750px',
      height: '510px',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      data: data
    });
  }
  openDialog(data: any) {
    this.dialog.open(CandidateSheduleComponent, {
      panelClass: 'scheduleVideoPopup',
      width: '60%',
      height: '100%',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      data: {
        scheduleId: data.id,
        attributes: {
          batchName: data.attributes.batchName,
          packageTemplateName: data.attributes.packageTemplateName,
          startDateTime: data.attributes.startDateTime,
          endDateTime: data.attributes.endDateTime,
          duration: data.attributes.duration,
          sendnotification: data.attributes.send_Notification,
          resendnotification: data.attributes.reSendNotification
        }
      }

    });
  }

  deliverableStatus(val: any) {
    let obj = {
      scheduleId: val.id
    };
    this.shedule.generateDelivery(obj).subscribe((res: any) => {
      if (res.success) {
        this.socketProgres();
        this.refreshList(val.attributes.orgId)
        this.toaster.success(res.message);
      } else {
        this.toaster.warning(res.message);
      }
    });
  }


  refreshList(ordId) {
    this.store.dispatch(
      getScheduledAssessment({
        payload: {
          pageMetaData: {
            limit: 30,
            nextOffset: 0,
            offset: 0
          },
          searchString: '',
          status: '',
          orgId: ordId,
          startDateTime: '',
          endDateTime: '',
          deliveryStatus: '',
          assessmentFlow: ''
        }
      })
    );
    this.store.dispatch(clearCandidatesAssessmentExportData());
  }

  socketProgres() {
    this.websocket.listen('deliverySyncDet').subscribe((res: any) => {
      this.progressBarvalue = res?.taskSycPercentage;
      this.store.dispatch(
        getScheduledAssessment({
          payload: {
            pageMetaData: {
              limit: 30,
              nextOffset: 0,
              offset: 0
            },
            searchString: '',
            status: '',
            orgId: '',
            startDateTime: '',
            endDateTime: '',
            deliveryStatus: '',
            assessmentFlow: ''
          }
        })
      );
      this.store.dispatch(clearCandidatesAssessmentExportData());
    });

    this.websocket.scheduleListen('scheduleCreate').subscribe((res: any) => {

      this.store.dispatch(
        getScheduledAssessment({

          payload: {
            pageMetaData: {
              limit: 30,
              nextOffset: 0,
              offset: 0
            },
            searchString: '',
            status: '',
            orgId: '',
            startDateTime: '',
            endDateTime: '',
            deliveryStatus: '',
            assessmentFlow: ''
          }
        })
      );
      this.store.dispatch(clearCandidatesAssessmentExportData());
    });
  }

  async syncTerminate(scheduleId) {
    this.api.syncTerminateAPI({ scheduleId: scheduleId }).subscribe(async (resData: any) => {
      this.toaster.success(resData.message);
    });
  }

  async syncStatus(schedule) {
    this.api.syncStatusAPI({ scheduleId: schedule.id }).subscribe(async (resData: any) => {
      if (resData.success) {
        this.dialog.open(CandidateSyncDetailsComponent, {
          panelClass: 'scheduleVideoPopup',
          width: '60%',
          height: '100%',
          autoFocus: false,
          closeOnNavigation: true,
          disableClose: true,
          data: {
            scheduleId: schedule.id,
            attributes: schedule.attributes,
            syncDetails: resData.data
          }
        });
      } else {
        this.toaster.success(resData.message);
      }
    });

    this.sendData.getMessage().subscribe((data) => {
      if (data.key == "terminateDelivery") {
        this.syncTerminate(data.value)
      } else if (data.key == "syncDelivery") {
        this.deliverableStatus({ id: data.value })
      }
    })
  }

  candidateProfileSubmission(scheduledTemplate) {
    sessionStorage.setItem('scheduleid', scheduledTemplate.id)
    this.router.navigate(['/admin/schedule/candidateprofilesubmission'])
  }
  candidateInformation(data: any) {
    sessionStorage.setItem('scheduleid', data.id),
      sessionStorage.setItem('candidateStatus', 'candidateValue'),
      this.router.navigate(['/admin/schedule/candidateinformation'], { state: { data: data } });
  }
}
