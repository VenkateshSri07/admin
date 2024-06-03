import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssesmentsUtil } from 'src/app/admin/assessments/assessments.common.utils';
import { ScheduleAPIService } from 'src/app/rest-api/schedule-api/schedule-api.service';
import { ScheduleUtils } from '../../schedule.utils';
@Component({
  selector: 'uap-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.scss']
})
export class CandidateViewComponent implements OnInit {
  public viewDetils: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public scheduleUtil: ScheduleUtils, public assesmentsUtil: AssesmentsUtil, public shedule: ScheduleAPIService,) { }
  public Tcounts: any;
  public Tbounce: any;
  public Tdelivered: any;

  ngOnInit(): void {
    this.viewDetils = this.data;
    this.viewCandidateEmailStatus()
  }


  viewCandidateEmailStatus() {
    const obj = {
      "scheduleId": this.viewDetils.id
    }
    this.shedule.CandidateEmailStatus(obj).subscribe(
      (res: any) => {
        this.Tdelivered = this.viewDetils?.attributes?.send_Notification == 1 ? res.count.deliveredCount : 0
        this.Tbounce = this.viewDetils?.attributes?.send_Notification == 1 ? res.count.bouncedCount : 0
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
