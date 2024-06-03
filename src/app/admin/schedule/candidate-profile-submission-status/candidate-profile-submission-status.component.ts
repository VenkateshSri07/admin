import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { ScheduleAPIService } from 'src/app/rest-api/schedule-api/schedule-api.service';
import { ToastrService } from 'ngx-toastr';
import { SentData } from 'src/app/rest-api/sendData';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
@Component({
  selector: 'uap-candidate-profile-submission-status',
  templateUrl: './candidate-profile-submission-status.component.html',
  styleUrls: ['./candidate-profile-submission-status.component.scss']
})
export class CandidateProfileSubmissionStatusComponent implements OnInit {
  @ViewChild('matDialog', { static: false }) matDialogRef: TemplateRef<any>;
  @ViewChild('matDialog1', { static: false }) matDialogRef1: TemplateRef<any>;
  scheduleId: any;
  candidateInfo: any;
  updatedCandidateInfo: any;
  updatedKeyObj: any;
  public columnDefs = [];
  rowData: any = [];
  removalValue: any;
  candidateMailId: any;
  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
  };
  removeShortlist: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private sendData: SentData, private router: Router, public scheduleService: ScheduleAPIService, private toaster: ToastrService,
    private gv: GlobalValidatorService) { }

  ngOnInit(): void {
    this.scheduleId = sessionStorage.getItem('scheduleid');
    if (this.scheduleId) {
      this.getCandidateProfileSubmissionStatus(this.scheduleId)
    }
    this.tabledef();
  }


  formInitialize() {
    this.removeShortlist = this.fb.group({
      remarks: [null, [Validators.required, this.gv.whiteSpace()]],
    })
  }

  tabledef() {
    this.columnDefs = [
      {
        headerName: 'Email',
        field: 'email',
        filter: 'agTextColumnFilter',
        tooltipField: 'email',
      },
      {
        headerName: 'Name',
        field: 'name',
        filter: 'agTextColumnFilter',
        tooltipField: 'name',
      },
      {
        headerName: 'Profile',
        width: 120,
        field: 'profile',
        filter: 'agTextColumnFilter',
        tooltipField: 'profile',
        cellRenderer: (params) => {
          if (params.value == 'Correct') {
            return '<div  class="buttonHead"><span class="green">' + params.value + '</span></div>'
          } else if (params.value == 'InCorrect') {
            return '<div class="buttonHead"><span class="red">' + 'Incorrect' + '</span></div>';
          } else if (params.value == 'Not Submitted') {
            return '<div class="buttonHead"><span class="yellow">' + params.value + '</span></div>';
          } else {
            return '-'
          }
        }
      },
      {
        headerName: 'Profile Submitted Date',
        field: 'profilesubmittedDate',
        filter: 'agTextColumnFilter',
        cellRenderer: (params) => {
          if (params.value == '-') {
            return '-'
          } else {
            return moment(params.value).format('DD-MMM-YYYY')
          }
        }
      },
      {
        headerName: 'Rectified',
        width: 110,
        field: 'rectified',
        filter: 'agTextColumnFilter',
        tooltipField: 'rectified',
      },
      {
        headerName: 'Rectified Date',
        width: 150,
        field: 'RectifiedDate',
        filter: 'agTextColumnFilter',
        cellRenderer: (params) => {
          if (params.value == '-') {
            return '<div class="textcenterAlign">-</div>'
          } else {
            return moment(params.value).format('DD-MMM-YYYY')
          }
        }
      },
      {
        headerName: 'View the Difference',
        floatingFilter: false,
        field: 'viewthedifference',
        filter: 'agTextColumnFilter',
        tooltipField: 'viewthedifference',
        cellRenderer: (params) => {
          return '<div class="linkHead"><span class="link">View Profile</span></div>'
        }
      },
      {
        headerName: 'Profile Sync',
        field: 'sync',
        width: 130,
        floatingFilter: false,
        cellRenderer: (params) => {
          if (params && params.data && params.data.rectified == 'Yes' && params?.data?.candidateSubmissionStatus == 'YetToStart' && params?.data?.candidateSubmissionSync != true && params?.data?.isShortlistRemoved != true) {
            return '<div class="buttonHead"><span><button class="btnsm blue-btn">Sync</button></span></div>'
          } else if (params && params.data && params.data.rectified == 'Yes' && params?.data?.candidateSubmissionStatus == 'ReSync' && params?.data?.candidateSubmissionSync != true && params?.data?.isShortlistRemoved != true) {
            return '<div class="buttonHead"><span><button class="btnsm-reSync">Re Sync</button></span></div>'
          } else if (params && params.data && params.data.rectified == 'Yes' && params?.data?.candidateSubmissionStatus == 'InProgress' && params?.data?.candidateSubmissionSync != true && params?.data?.isShortlistRemoved != true) {
            return '<div class="buttonHead"><span class="Yellow-btn">In Progress</span></div>'
          } else if (params && params.data && params.data.rectified == 'Yes' && params?.data?.candidateSubmissionStatus == 'Completed' && params?.data?.candidateSubmissionSync == true && params?.data?.isShortlistRemoved != true) {
            return '<div class="buttonHead"><span class="status">Synced</span></div>'
          } else {
            return '<div class="textcenterAlign">-</div>';
          }
        }
      },
      {
        headerName: 'Shortlist Remove',
        field: 'remove',
        width: 170,
        floatingFilter: false,
        cellRenderer: (params) => {
          if (params && params.data && params.data.rectified == 'Yes' && params?.data?.isShortlistRemoved != true && params?.data?.candidateSubmissionSync != true && (params?.data?.candidateSubmissionStatus == 'YetToStart' || params?.data?.candidateSubmissionStatus == 'ReSync')) {
            return '<div class="buttonHead"><span><button class="btnsm-red red-btn">Remove</button></span></div>'
          } else if (params && params.data && params.data.rectified == 'Yes' && params?.data?.isShortlistRemoved == true && params?.data?.candidateSubmissionSync != true) {
            return '<div class="buttonHead"><span class="status-red">Removed</span></div>'
          } else {
            return '<div class="textcenterAlign">-</div>';
          }

        }
      }
    ]
  }

  onGridReady(params: any) { }

  onCellClicked(event: any, params: any) {
    if (event && event.column && event.column.userProvidedColDef && event.column.userProvidedColDef.field == 'viewthedifference') {
      this.getcandidateDetails(event?.data?.email)
    }

    if (event && event.column && event.column.userProvidedColDef && event.column.userProvidedColDef.field == 'sync') {
      if (event && event.data && event.data.rectified == 'Yes' && event?.data?.candidateSubmissionSync != true && (event?.data?.candidateSubmissionStatus == 'YetToStart' || event?.data?.candidateSubmissionStatus == 'ReSync') && event?.data?.isShortlistRemoved != true) {
        this.CandidateProfilesync(event?.data?.email, 'sync')
      }
    }
    if (event && event.column && event.column.userProvidedColDef && event.column.userProvidedColDef.field == 'remove') {
      if (event && event.data && event.data.rectified == 'Yes' && event?.data?.isShortlistRemoved != true && event?.data?.candidateSubmissionSync != true && (event?.data?.candidateSubmissionStatus == 'YetToStart' || event?.data?.candidateSubmissionStatus == 'ReSync')) {
        this.candidateMailId = event?.data?.email;
        this.formInitialize()
        this.matDialogRemove();
      }
    }
  }

  backtolistpage() {
    this.router.navigate(['/admin/schedule/list'])
  }

  // Get candidate profile list
  getCandidateProfileSubmissionStatus(scheduleid) {
    let data = {
      scheduleId: scheduleid ? scheduleid : '',
    }
    this.scheduleService.getCandidateProfileSubmissionStatus(data).subscribe((res: any) => {
      if (res.success) {
        this.rowData = res.data
      } else {
        this.sendData.warning(res.message);
      }
    });
  }

  getcandidateDetails(email) {
    let data = {
      scheduleId: this.scheduleId ? this.scheduleId : '',
      emailId: email ? email : ''
    }
    this.scheduleService.getcandidateDetails(data).subscribe((res: any) => {
      if (res.success) {
        this.candidateInfo = res.data.candidateInfo;
        this.updatedCandidateInfo = res.data.updatedCandidateInfo;
        this.updatedKeyObj = res.data.updatedKeyObj;
        this.matDialogOpen();
      } else {
        this.sendData.warning(res.message);
      }
    });
  }

  CandidateProfilesync(email, type) {
    let updatedBy = sessionStorage.getItem('user');
    let data = {
      scheduleId: this.scheduleId ? this.scheduleId : '',
      emailId: email ? email : this.candidateMailId,
      updatedBy: updatedBy ? JSON.parse(updatedBy).attributes.email : '',
      type: type,
      remarks: this.removalValue
    }
    this.scheduleService.candidateProfileSubmissionSync(data).subscribe((res: any) => {
      if (res.success) {
        this.sendData.success(res.message);
        this.closeDialog();
        this.getCandidateProfileSubmissionStatus(this.scheduleId);
      } else {
        this.closeDialog();
        this.sendData.warning(res.message);
      }
    });
  }

  onRemove(textarea) {
    this.removalValue = textarea;
    this.CandidateProfilesync('', 'remove')
  }
  matDialogOpen() {
    const dialogRef = this.dialog.open(this.matDialogRef, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  matDialogRemove() {
    const dialogRef = this.dialog.open(this.matDialogRef1, {
      width: '591px',
      height: '326px',
      disableClose: true,
    });
  }



  closeDialog() {
    this.dialog.closeAll();
  }

}
