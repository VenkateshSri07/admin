import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { ScheduleAPIService } from '../../../rest-api/schedule-api/schedule-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CandidateSendEmailComponent } from '../candidate-shedule-common/candidate-send-email/candidate-send-email.component';
@Component({
  selector: 'uap-candidate-information',
  templateUrl: './candidate-information.component.html',
  styleUrls: ['./candidate-information.component.scss']
})
export class CandidateInformationComponent implements OnInit {

  public columnDefs = [];
  yetToSatartCount = 0;
  inProgressCount = 0;
  completedCount = 0;
  scheduleId: any;
  candidateInfo: any;
  public totalcount: any;
  isBulkButton: boolean = false;
  candidateEmailData: boolean = false;
  emailValue: any;
  snaming: any;
  product: any;
  candidateValue: any;
  totalemaildate: boolean = true
  public searchData: string = '';
  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
  };
  bouncedCount: any;
  deliveredCount: any;

  ngOnInit(): void {
    this.scheduleId = sessionStorage.getItem("scheduleid");
    this.candidateValue = sessionStorage.getItem("candidateStatus");
    this.tabledef();
    this.viewCandidateEmailStatus(this.scheduleId);
  }
  constructor(
    private router: Router, public schedule: ScheduleAPIService,
    public dialog: MatDialog,
  ) {
    if (this.router.getCurrentNavigation()?.extras !== null && this.router.getCurrentNavigation()?.extras !== undefined && this.router.getCurrentNavigation().extras.state.data !== null && this.router.getCurrentNavigation().extras.state.data !== undefined) {
      this.getCandidateDetails(this.router.getCurrentNavigation().extras.state.data)
    }
  }

  getCandidateDetails(data) {
    this.snaming = data;
    if (data.attributes?.send_Notification == 0 && data.attributes?.reSendNotification == 0) {
      this.candidateEmailData = true;
      this.totalemaildate = false
    }
  }

  tabledef() {
    this.columnDefs = [
      {
        headerName: 'Candidate Name',
        field: 'firstName',
        filter: 'agTextColumnFilter',
        tooltipField: 'Candidate Name',
      },
      {
        headerName: 'Email Id',
        field: 'email',
        width: 270,
        filter: 'agTextColumnFilter',
        tooltipField: 'Email Id',
      },
      {
        headerName: 'Email Status',
        field: 'email_status',
        filter: 'agTextColumnFilter',
        tooltipField: 'Email Status',
        width: 200,
        cellRenderer: (params: any) => {
          if (this.totalemaildate) {
            if (params.data.email_status === 'delivered') {
              return `<span class="email_status">${params.data.email_status}</span>`;
            } else {
              return `<span class="email_status">Bounced</span>`;
            }
          } else {
            return `<span class="email_status">Not Delivered</span>`;
          }
        }
      },
      {
        headerName: 'Test Status',
        width: 200,
        field: 'status',
        filter: 'agTextColumnFilter',
        tooltipField: 'Test Status',
        cellRenderer: (params: any) => {
          if (params.data.status === 'YetToStart') {
            return `<span class="YetToStart">${params.data.status}</span>`;
          } else if (params.data.status === 'InProgress') {
            return `<span class="InProgress">${params.data.status}</span>`;
          }
          else if (params.data.status === 'Completed') {
            return `<span class="Completed">${params.data.status}</span>`;
          }
          else {
            return '-'
          }
        }

      },
      {
        headerName: 'Test Completion',
        field: 'completedCount',
        filter: 'agTextColumnFilter',
        tooltipField: 'Total Count',
        cellRenderer: (params: any) => {
          return `<span>${params.data.completedCount}/${params.data.totalcount}</span>`;

        }
      },
      {
        headerName: 'Restricted Attempt',
        field: 'completedCount',
        filter: 'agTextColumnFilter',
        tooltipField: 'Completed Count',
        cellRenderer: (params: any) => {
          if (params.data.attemptRestrict == 0) {
            return '<span>-</span>'
          } else {
            return `<span>${params.data.attemptCount}/${params.data.numberOfattempt}</span>`;
          }
        }
      },
      {
        headerName: 'Actions',
        field: 'Actions',
        filter: 'agTextColumnFilter',
        tooltipField: 'Actions',
        width: 200,
        cellRenderer: (params) => {
          if (this.snaming?.attributes?.send_Notification == 0) {
            return '<span>-</span>'
          } else {
            return '<div class="linkHead"><span class="link"> <i class="material-icons">email</i> Resend Email</span></div>'
          }

        }
      },
    ]
  }

  onCellClicked(event: any, params: any) {
    if (event && event.column && event.column.userProvidedColDef && event.column.userProvidedColDef.field == 'Actions') {
      if (this.snaming?.attributes?.send_Notification != 0) {
        this.openEmailDialog([event.data.email])
      }
    }
  }
  backtolistpage() {
    this.router.navigate(['/admin/schedule/list'])
  }

  viewCandidateEmailStatus(scheduleId) {
    let data = {
      scheduleId: scheduleId ? scheduleId : '',
    }
    this.schedule.CandidateEmailStatus(data).subscribe(
      (res: any) => {
        this.candidateInfo = res?.data;
        this.emailValue = res?.data[0]?.status;
        this.totalcount = res?.count?.totalcount;
        this.bouncedCount = res?.count?.bouncedCount;
        this.deliveredCount = res?.count?.deliveredCount;
        this.yetToSatartCount = 0;
        this.inProgressCount = 0;
        this.completedCount = 0;
        this.candidateInfo.forEach((elem) => {
          if (elem.status == "YetToStart") {
            this.yetToSatartCount = this.yetToSatartCount + 1;
            this.isBulkButton = true;
          } else if (elem.status == "InProgress") {
            this.inProgressCount = this.inProgressCount + 1;
          } else if (elem.status == "Completed") {
            this.completedCount = this.completedCount + 1;
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openEmailDialog(email) {
    const newObj = Object.assign({ email: email }, this.snaming);
    this.dialog.open(CandidateSendEmailComponent, {
      width: '750px',
      height: '550px',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      data: newObj
    });
  }

  isEmailSync() {
    var array = [];
    this.candidateInfo.forEach((elem) => {
      if (elem.status == "YetToStart") {
        array.push(elem.email);
      }
    });
    this.openEmailDialog(array);
  }

}
