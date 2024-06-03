import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SentData } from 'src/app/rest-api/sendData';
import { CandidateSheduleComponent } from '../candidate-shedule.component';

@Component({
  selector: 'uap-candidateSyncDetails',
  templateUrl: './candidateSyncDetails.component.html',
  styleUrls: ['./candidateSyncDetails.component.scss']
})
export class CandidateSyncDetailsComponent implements OnInit {
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;
  @ViewChild('terminateSyncpopup', { static: false }) terminateSyncpopup: TemplateRef<any>;
  @ViewChild('reSyncpopup', { static: false }) reSyncpopup: TemplateRef<any>;
  dataSource = new MatTableDataSource<any>([]);
  completedCheck = false;
  emptyData = new MatTableDataSource([{ empty: "row" }]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    'taskType',
    'instanceId',
    'candidateCount',
    'status',
    'errorMessage'
  ];

  countObj: any = { pendingCount: 0, CompletedCount: 0 };
  childPopUp: any;
  totalPartnerCount = 0;
  terminatedStatus = false;
  // dialog: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CandidateSheduleComponent>,
    private sendData: SentData,

  ) { }


  ngOnInit(): void {
    this.dialogRef.disableClose = true
    this.totalPartnerCount = this.data.syncDetails.length;
    this.dataSource.data = this.data.syncDetails;
    this.data.syncDetails.forEach(elem => {
      if (elem.syncStatus) {
        this.countObj.CompletedCount = this.countObj.CompletedCount + 1;
      } else {
        this.countObj.pendingCount = this.countObj.pendingCount + 1;
      }
    });

    if(this.countObj.CompletedCount == this.data.syncDetails.length){
      this.completedCheck = true;
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



  exportCsv() {
    this.downloadFile(this.dataSource.data, 'deliveryDetails');
  }


  downloadFile(data, filename = 'deliveryDetails') {
    let csvData = this.ConvertToCSV(data, ['taskType', 'instanceId', 'learnerCount', 'syncStatus', 'errorMsg'],['Task Type', 'Instance Id', 'No. of Candidates', 'Delivery Status', 'Error Message']);
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

  ConvertToCSV(objArray, headerKey, headerDisplayKey ) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    for (let index in headerDisplayKey) {
      row += headerDisplayKey[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerKey) {
        let head = headerKey[index];
        console.log(head,array[i][head])
        let value = typeof(array[i][head]) == "undefined" ? "-":array[i][head];
        if(head == "syncStatus" && value == true){
          value = "Completed"
        }else if(head == "syncStatus" && value == false){
          var head1 = headerKey[4];
          if( head1 == "errorMsg" && typeof(array[i][head1]) == "undefined"){
            value = "Pending"
          }else{
            value = "Failed"
          }
        }

        line += ',' + value;
      }
      str += line + '\r\n';
    }
    return str;
  }

  deliverableStatus() {
    this.childPopUp = this.dialog.open(this.reSyncpopup, {
      width: '519px',
      height: '324px',
      disableClose: true
    });

  }
  deliverableStatusSync() {
    // this.childPopUp.close();
    this.dialog.closeAll()
    var obj = {
      key: "syncDelivery",
      value: this.data.scheduleId
    }
    this.sendData.sendMessage(obj);
  }


  terminateStatus() {
    this.childPopUp = this.dialog.open(this.terminateSyncpopup, {
      width: '519px',
      height: '324px',
      disableClose: true
    })
  }

  terminateStatusSync() {
    this.childPopUp.close();
    var obj = {
      key: "terminateDelivery",
      value: this.data.scheduleId
    }
    this.terminatedStatus = true;
    this.sendData.sendMessage(obj);
  }
  // closeAllPopup() {
  //   this.dialog.closeAll()
  // }

  childPopUpClose() {
    this.childPopUp.close();

  }
}
