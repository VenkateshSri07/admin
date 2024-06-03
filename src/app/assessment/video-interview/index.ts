
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CountdownModule } from 'ngx-countdown';
import { MaterialModule } from 'src/app/material/material.module';
import { VideoInterviewRoutingModule } from './video-interview-routing.module';
import { VideoInterviewComponent } from './video-interview.component';
import { CdTimerModule } from 'angular-cd-timer';
import { SafePipe } from 'src/app/shared/pipe/safePipe';


@NgModule({
  imports: [CdTimerModule, CommonModule, MatButtonModule, MatIconModule, MaterialModule, VideoInterviewRoutingModule, CountdownModule],
  declarations: [VideoInterviewComponent, SafePipe],
  exports: [VideoInterviewComponent]
})
export class VideoInterviewModule { }
