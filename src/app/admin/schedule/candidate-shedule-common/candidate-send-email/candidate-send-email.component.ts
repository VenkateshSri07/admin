import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScheduleAPIService } from 'src/app/rest-api/schedule-api/schedule-api.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { SentData } from 'src/app/rest-api/sendData';
import * as moment from 'moment'; //in your component
@Component({
  selector: 'uap-candidate-send-email',
  templateUrl: './candidate-send-email.component.html',
  styleUrls: ['./candidate-send-email.component.scss'],
  // standalone: true,

})
export class CandidateSendEmailComponent implements OnInit {
  reasonmail: FormGroup;
  matDialog: any;
  constructor(

    @Inject(MAT_DIALOG_DATA) public data: any,

    public dialogRef: MatDialogRef<CandidateSendEmailComponent>,
    public shedule: ScheduleAPIService,
    private sendData: SentData,
    private toaster: ToastrService,
    private _fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    console.log(this.data, '-------> dataa')
    this.initailizeForm();
    this.dialogRef.disableClose = true;
    sessionStorage.getItem("candidateValue");
  }
  initailizeForm() {
    this.reasonmail = new FormGroup({
      reason: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z][a-zA-Z ]+'),
        Validators.maxLength(200)
      ]),
    });
  }
  get reason() {
    return this.reasonmail.get('reason')!;
  }
  notificationSend(emailpopupdata) {
    const resendmsg = this.reasonmail.controls['reason'].value
    if (emailpopupdata.attributes.send_Notification == 1 &&
      emailpopupdata.attributes.reSendNotification == 0) {
      if (this.reasonmail.valid) {
        const resend = {
          scheduleId: emailpopupdata.id,
          type: 'reSend',
          reason: resendmsg
        };
        this.shedule.CandidateSentEmail(resend).subscribe((response: any) => {
          if (response.message) {
            this.toaster.success(response.message);
            this.dialogRef.close();
            this.sendData.sendMessage(response.message)
          } else {
            this.toaster.warning(response.message);
          }
        });
      }

    } else if (emailpopupdata.attributes.send_Notification == 0 && emailpopupdata.attributes.reSendNotification == 0) {
      const send = {
        scheduleId: emailpopupdata.id,
        type: 'sendmail'
      };
      this.shedule.CandidateSentEmail(send).subscribe((response: any) => {
        if (response.message) {
          this.toaster.success(response.message);
          this.dialogRef.close();
          this.sendData.sendMessage(response.message)
        } else {
          this.toaster.warning(response.message);
        }
      });
    } else if (emailpopupdata.attributes.send_Notification != '0') {
      const popupresendemail = {
        "scheduleId": emailpopupdata.id,
        "type": "reSend",
        "emails": emailpopupdata.email,
      };
      this.shedule.CandidateSentEmail(popupresendemail).subscribe((response: any) => {
        if (response.message) {
          this.toaster.success(response.message);
          this.dialogRef.close();
          this.sendData.sendMessage(response.message)
        } else {
          this.toaster.warning(response.message);
        }
      });
    }
  }


  getScheduledOn(ScheduledTime: string): string {
    // var concatedDateTimeoffset = (new Date()).getTimezoneOffset() * 60000;
    // const scheduledDate = (new Date(new Date(ScheduledTime).getTime() + concatedDateTimeoffset));

    const scheduledDate = new Date(ScheduledTime);
    const month = scheduledDate.getMonth();
    const year = scheduledDate.getFullYear();
    const date = scheduledDate.getDate();
    let hh = scheduledDate.getHours();
    const m = scheduledDate.getMinutes();
    let dd = 'AM';
    if (hh >= 12) {
      hh = hh - 12;
      dd = 'PM';
    }
    if (hh === 0) {
      hh = 12;
    }
    let minutext;
    if (m < 10) {
      minutext = `0${m}`;
    } else {
      minutext = m;
    }
    let hourText;
    if (hh < 10) {
      hourText = `0${hh}`;
    } else {
      hourText = hh;
    }
    const timeText = `${hourText}:${minutext} ${dd}`;
    const scheduledTimeOn = `${date} ${this.getMonth(month)} ${year} | ${timeText}`;
    return scheduledTimeOn;
  }
  getMonth(month: number): string {
    const allMonth = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC'
    ];
    const monthText = allMonth[month];
    return monthText;
  }


  getDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    if (duration == 60) {
      return `${hours} Hr`;
    }
    else if (hours > 0 && mins > 0) {
      if (hours == 1) {
        return `${hours} Hr ${mins} Mins`;
      }
      return `${hours} Hrs ${mins} Mins`;
    } else if (hours > 0) {
      return `${hours} Hrs`;
    }
    else {
      return `${mins} Mins`;
    }
  }


  // getDuration(duration: number): string {
  //   let durationText = '';
  //   if (duration < 60) {
  //     durationText = `${this.getFixedDuration(duration)} Mins`;
  //   } 
  //   else if (duration === 60) {
  //     durationText = `1 Hr`;
  //   }
  //    else {
  //     durationText = `${this.getFixedDuration(duration / 60)}`;
  //   }
  //   return durationText;
  // }

  // getFixedDuration(duration) {
  //   debugger;
  //   if (Number.isInteger(duration)) {
  //   return String(duration+'        '+'Hrs'); 
  //   } else {
  //     var rhours = Math.floor(duration);
  //     var minutes = (duration - rhours) * 60;
  //     var rminutes:any = Math.round(minutes);
  //     if(rminutes < 10){
  //       rminutes = "0"+rminutes;
  //     }
  //     return String(rhours+'        '+'Hrs' + rminutes +'      '+ 'Mins');
  //   }
  // }

  getUpdateTime(time: string, status: string): string {
    let dateOn = moment(time).format('MM-DD-YYYY');
    let today = moment();
    // const date = new Date(time);
    // const currentTime = new Date();
    // const differenceInTime = currentTime.getTime() - date.getTime();
    // const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const differenceInDays = today.diff(dateOn, 'days');
    let updateTimeText = '';
    if (Math.trunc(differenceInDays) < 1) {
      updateTimeText = 'Today';
    } else {
      updateTimeText = `${Math.trunc(differenceInDays) == 1 ? Math.trunc(differenceInDays) + ' day ago' : Math.trunc(differenceInDays) + ' days ago'}`;
    }
    return status === 'Draft' ? `Created ${updateTimeText}` : updateTimeText;
  }
}



