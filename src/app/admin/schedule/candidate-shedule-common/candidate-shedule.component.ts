import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { element } from 'protractor';
import { ScheduleAPIService } from '../../../rest-api/schedule-api/schedule-api.service';
import { CandidateSendEmailComponent } from './candidate-send-email/candidate-send-email.component';
// import { MatPaginator, MatTableDataSource } from '@angular/material';
@Component({
  selector: 'uap-candidate-shedule',
  templateUrl: './candidate-shedule.component.html',
  styleUrls: ['./candidate-shedule.component.scss']
})
export class CandidateSheduleComponent implements OnInit {
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource<any>([]);
  emptyData = new MatTableDataSource([{ empty: "row" }]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    'CandidateName|EmailId',
    'EmailStatus',
    'TestStatus',
    'TestCompletion',
    'Actions'
  ];
  candidatedisplayColumns: string[] = [
    'CandidateName|EmailId',
    'EmailStatus',
    'TestStatus',
    'TestCompletion'
  ]
  candidateEmailData: boolean = false;
  totalemaildate: boolean = true
  countObj: any = {};
  isBulkButton: boolean = false;
  yetToSatartCount = 0;
  inProgressCount = 0;
  completedCount = 0;
  // dialog: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shedule: ScheduleAPIService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CandidateSheduleComponent>,
  ) { }

  public details;
  public detailstwo: any = [];
  public Tcounts: any;
  public Tbounce: any;
  public Tdelivered: any;
  public searchData: string = '';
  ngOnInit(): void {
    this.dialogRef.disableClose = true
    if (this.data.attributes.sendnotification == 0 && this.data.attributes.resendnotification == 0) {
      this.candidateEmailData = true;
      this.totalemaildate = false
    }
    this.viewCandidateEmailStatus();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

  }
  viewCandidateEmailStatus() {
    this.shedule.CandidateEmailStatus(this.data).subscribe(
      (res: any) => {
        this.dataSource.data = res?.data;
        this.Tcounts = res?.count.totalcount;
        this.countObj = res?.count;
        this.yetToSatartCount = 0;
        this.inProgressCount = 0;
        this.completedCount = 0;
        this.dataSource.data.forEach((elem) => {
          if (elem.status == "YetToStart") {
            this.yetToSatartCount = this.yetToSatartCount + 1;
            this.isBulkButton = true;
          } else if (elem.status == "InProgress") {
            this.inProgressCount = this.inProgressCount + 1;
          } else if (elem.status == "Completed") {
            this.completedCount = this.completedCount + 1;
          }
        });
        // this.detailstwo = this.dataSource[0].data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openEmailDialog(email) {
    this.data.email = email;
    this.dialog.open(CandidateSendEmailComponent, {
      width: '750px',
      height: '550px',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      data: this.data
    });
    // this.dialogRef.close();
  }

  emailSearch() {
    this.data.email = this.searchData;
    this.viewCandidateEmailStatus();
  }

  clearSearch() {
    delete this.data.email;
    this.searchData = '';
    this.viewCandidateEmailStatus();
  }

  exportCsv(candidatevalidate) {
    this.downloadFile(this.dataSource.data, 'viewStatus', candidatevalidate);
  }


  downloadFile(data, filename = 'viewStatus', candidatevalidate) {
    let csvData = this.ConvertToCSV(data, ['email', 'firstName', 'lastName', 'status', 'email_status']);
    if (candidatevalidate) {
      csvData = this.ConvertToCSV(data, ['email', 'firstName', 'lastName']);
    }
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];
        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }

  isEmailSync() {
    var array = [];
    this.dataSource.data.forEach((elem) => {
      if (elem.status == "YetToStart") {
        array.push(elem.email);
      }
    });
    this.openEmailDialog(array);
  }
}