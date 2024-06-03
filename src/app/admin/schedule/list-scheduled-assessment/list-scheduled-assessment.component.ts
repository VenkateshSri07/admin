import { Component, OnInit } from '@angular/core';
import { ScheduledAssessmentResponseModel } from 'src/app/rest-api/schedule-api/models/scheduled-assessments-response.model';
import { AssessmentsModuleEnum } from '../../assessments/assessments.enums';
import { Store } from '@ngrx/store';
import { SchedulerReducerState, FilterValueModel } from '../redux/schedule.model';
import { getScheduledAssessment } from '../redux/schedule.actions';
import {
  selectScheduledAssessMentsState,
  selectLoadingScheduledAssessment
} from '../redux/schedule.reducers';
import { selectCategoryWithMenuOptions } from 'src/app/redux/reference-data/reference-data.reducer';
import {
  CategoryWithMenuOptions,
  SelectMenuOption
} from 'src/app/redux/reference-data/reference-data.model';
import { ScheduleModuleEnum } from '../schedule.enums';
import { ScheduleAPIService } from 'src/app/rest-api/schedule-api/schedule-api.service';
import { SentData } from 'src/app/rest-api/sendData';
import { DatePipe } from '@angular/common';
import { UserAPIService } from 'src/app/rest-api/user-api/user-api.service';


@Component({
  selector: 'app-list-scheduled-assessment',
  templateUrl: 'list-scheduled-assessment.component.html',
  styleUrls: ['list-scheduled-assessment.component.scss']
})
export class ListScheduledAssessmentComponent implements OnInit {
  isshowdaterange = false;
  isshowclose = false;
  myDateValue: Date;
  startDate: any;
  toDate: Date;
  duplicateArray = []
  dateRangeStart: Date;
  dateRangeEnd: Date;
  listOfOrg: any;
  orginfo: string;
  proctorTemplateList: any;
  // startDate: any;
  endDate: any;
  searchString: string;
  showLazyLoading: boolean;
  selectedIndex: number;
  selcetedOrg: number;
  defaultOrg: any;
  roleCode: any;
  filterValues: FilterValueModel[] = [
    { value: '', viewValue: AssessmentsModuleEnum.AllAssessmentStatus }
  ];
  deliveryStatusArr = [

    {
      name: 'All',
      value: 'All'
    },
    {
      name: 'Create Delivery',
      value: 'pending'
    },

    {
      name: 'Inprogress',
      value: 'inprogress'
    },
    {
      name: 'Failed',
      value: 'failed'
    },
    {
      name: 'Terminated',
      value: 'terminated'
    },
    {
      name: 'Created',
      value: 'completed'
    },
  ]

  assessmentFlow = [
    {
      name: 'All',
      value: 'All'
    },
    {
      name: 'Parallel Flow',
      value: 'parallel'
    },
    {
      name: 'Sequential Flow',
      value: 'sequential'
    },
  ]

  // orgValues: FilterValueModel[] = [
  //   { value: '', viewValue: AssessmentsModuleEnum.AllAssessmentStatus }
  // ]

  selectedFilterValue: string = this.filterValues[0].value;
  selectedDeliveryValue: any = this.deliveryStatusArr[0].value;
  assessmentFlowValue: any = this.assessmentFlow[0].value;
  // OrganisationId:string = this.orgValues[0].value;
  scheduleAssessmentContent: ScheduledAssessmentResponseModel;
  minDate: Date;
  // toDate: Date;
  categoryWithMenuOption: any;
  dateSendingToServer: any = {};
  constructor(private sendData: SentData, private store: Store<SchedulerReducerState>, private scheduleService: ScheduleAPIService, public datepipe: DatePipe, private api: UserAPIService) { }
  ngOnInit(): void {
    this.roleCode = this.sendData.getUserRoleCode();
    // this.stateList();
    // this.districtList();
    // this.collegeList();
    this.getOrganisationNames()
    this.store
      .select(selectCategoryWithMenuOptions)
      .subscribe((categoryWithMenuOptions: CategoryWithMenuOptions) => {
        categoryWithMenuOptions.data.forEach((categoryWithMenuOption: SelectMenuOption) => {
          if (categoryWithMenuOption.name === ScheduleModuleEnum.ScheduleStatus) {
            categoryWithMenuOption.menuOptions.forEach((menuOption) => {
              this.filterValues.push({
                value: menuOption.code,
                viewValue: menuOption.decode
              });
            });
          }
        });
      });

    // this.sendData.getMessage().subscribe((data) => {
    //   if (data) {
    //     this.dispatchGetScheduledAssessment('', '', '', '', '');
    //   }
    // })

    // this.dispatchGetScheduledAssessment('', '', '', '', '');
    setTimeout(() => {
      this.store.select(selectScheduledAssessMentsState).subscribe((val) => {
        this.scheduleAssessmentContent = val;
        this.selectedIndex = -1;
      });

    }, 100);

    this.store.select(selectLoadingScheduledAssessment).subscribe((val) => {
      this.showLazyLoading = val;
    });
  }
  onSearch(searchString: string): void {
    this.searchString = searchString;
    this.dispatchGetScheduledAssessment(this.searchString, this.selectedFilterValue, this.orginfo ? this.orginfo : sessionStorage.getItem('orgId'), this.dateSendingToServer.start, this.dateSendingToServer.end, this.selectedDeliveryValue, this.assessmentFlowValue);
  }
  onFilterValueChange(filterValue: string): void {
    this.dispatchGetScheduledAssessment(this.searchString, filterValue, this.orginfo ? this.orginfo : sessionStorage.getItem('orgId'), this.dateSendingToServer.start, this.dateSendingToServer.end, this.selectedDeliveryValue, this.assessmentFlowValue);
  }

  onAssessmentFlowValueChange(assessmentFlow: string): void {
    this.dispatchGetScheduledAssessment(this.searchString, this.selectedFilterValue, this.orginfo ? this.orginfo : sessionStorage.getItem('orgId'), this.dateSendingToServer.start, this.dateSendingToServer.end, this.selectedDeliveryValue, assessmentFlow);
  }

  onFilterDeliveryValueChange(deliveryFilterValue: string): void {
    this.dispatchGetScheduledAssessment(this.searchString, this.selectedFilterValue, this.orginfo ? this.orginfo : sessionStorage.getItem('orgId'), this.dateSendingToServer.start, this.dateSendingToServer.end, deliveryFilterValue, this.assessmentFlowValue);
  }

  orgChange(orgInfo: any) {
    // if (orgInfo == 0) {
    //   orgInfo = {
    //     id: 0,
    //     name: "All",
    //     supportEmail: "assess.support@lntedutech.com",
    //     supportPhone: "08068753110",
    //     wecpOrgId: 0
    //   }
    // }
    this.orginfo = orgInfo.id ? orgInfo.id : orgInfo.orgId;
    this.dispatchGetScheduledAssessment(this.searchString, this.selectedFilterValue, this.orginfo ? this.orginfo : sessionStorage.getItem('orgId'), this.dateSendingToServer.start, this.dateSendingToServer.end, this.selectedDeliveryValue, this.assessmentFlowValue);
  }
  onStartChange(event: any) {
    this.orginfo = this.orginfo ? this.orginfo : sessionStorage.getItem('orgId')
    this.isshowdaterange = true;
    this.isshowclose = true;
    this.dateSendingToServer = {}
    this.dateSendingToServer.start = this.datepipe.transform(this.startDate, 'yyyy-MM-dd')
    this.dateSendingToServer.end = this.datepipe.transform(this.endDate, 'yyyy-MM-dd')
    this.dispatchGetScheduledAssessment(this.searchString, this.selectedFilterValue, this.orginfo ? this.orginfo : sessionStorage.getItem('orgId'), this.dateSendingToServer.start, this.dateSendingToServer.end, this.selectedDeliveryValue, this.assessmentFlowValue);
  }
  selectedIndexEvent(index: number): void {
    this.selectedIndex = index;
  }
  selectedOrgEvent(index: number): void {
    this.selcetedOrg = index
  }

  dispatchGetScheduledAssessment(searchString: string, status: string, orgId: string, startDate: string, endDate: string, deliveryStatus: string, assessmentFlow: string): void {
    this.store.dispatch(
      getScheduledAssessment({
        payload: {
          pageMetaData: {
            limit: 30,
            nextOffset: 0,
            offset: 0,
          },
          searchString: searchString ? searchString : '',
          status: status ? status : '',
          orgId: orgId ? orgId : sessionStorage.getItem('orgId'),
          startDateTime: startDate ? startDate : '',
          endDateTime: endDate ? endDate : '',
          deliveryStatus: deliveryStatus ? deliveryStatus : '',
          assessmentFlow: assessmentFlow ? assessmentFlow : ''
        }
      })
    );
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }


  // stateList() {
  //   let data;
  //   this.api.stateSync(data).subscribe((data) => {
  //     // console.log(data);
  //   })
  // }
  // districtList() {
  //   let data;
  //   this.api.districtSync(data).subscribe((data) => {
  //     // console.log(data);
  //   })
  // }
  // collegeList() {
  //   let data;
  //   this.api.collegeSync(data).subscribe((data) => {
  //   })
  // }

  getOrganisationNames() {
    const roleCode = this.sendData.getUserRoleCode();
    if (roleCode == 'ADM') {
      this.scheduleService.getWEPCOrganization({}).subscribe((response: any) => {
        if (response.success) {
          this.listOfOrg = response.data;
          this.listOfOrg.splice(0, 0, { orgId: 0, orgName: 'All' })
          this.defaultOrg = this.listOfOrg[0].orgId
          sessionStorage.setItem('orgId', this.defaultOrg);
          setTimeout(() => {
            this.orgChange(this.defaultOrg ? this.defaultOrg : this.listOfOrg[0])
          }, 3000);
        } else {
        }
      });
    } else {
      const orgList = this.sendData.getUserPermission();
      this.listOfOrg = orgList && orgList.organisations;
      this.defaultOrg = this.listOfOrg[0].orgId;
      sessionStorage.setItem('orgId', this.listOfOrg[0].orgId);
      setTimeout(() => {
        this.orgChange({ id: this.listOfOrg[0] })
      }, 3000);
    }
  }

  clearDate(event: any) {
    this.isshowdaterange = false;
    this.isshowclose = false;
    this.startDate = null;
    this.endDate = null;
    this.dateSendingToServer = {}
    this.dateSendingToServer.start = this.datepipe.transform(this.startDate, 'yyyy-MM-dd')
    this.dateSendingToServer.end = this.datepipe.transform(this.endDate, 'yyyy-MM-dd')
    this.dispatchGetScheduledAssessment(this.searchString, this.selectedFilterValue, this.orginfo ? this.orginfo : sessionStorage.getItem('orgId'), this.dateSendingToServer.start, this.dateSendingToServer.end, this.selectedDeliveryValue, this.assessmentFlowValue);

    event.stopPropagation();
  }
}
