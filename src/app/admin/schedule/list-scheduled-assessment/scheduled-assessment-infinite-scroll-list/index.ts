import { AssesmentsUtil } from './../../../assessments/assessments.common.utils';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduledInfiniteScrollListComponent } from './assessment-infinite-scroll-list.component';
import { YetToStartScheduledAssessmentModule } from './yet-to-start-scheduled-assessment';
import { InProgressScheduledAssessmentModule } from './in-progress-scheduled-assessment';
import { CompletedScheduledAssessmentModule } from './completed-scheduled-assessment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LazyLoaderModule } from 'src/app/shared/lazy-loader';
import { ScheduleUtils } from '../../schedule.utils';
import { MaterialModule } from 'src/app/material/material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
// import {NgCircleProgressModule} from 'ng-circle-progress';
import {WebSocketService} from 'src/app/rest-api/web-socket/web-socket.service';
import { NzProgressModule } from 'ng-zorro-antd/progress';
@NgModule({
  imports: [
    CommonModule,
    YetToStartScheduledAssessmentModule,
    InProgressScheduledAssessmentModule,
    CompletedScheduledAssessmentModule,
    InfiniteScrollModule,
    LazyLoaderModule,
    MaterialModule,
    MatDatepickerModule,
    MatTooltipModule,
    NzProgressModule,
    // NgCircleProgressModule
  ],
  exports: [ScheduledInfiniteScrollListComponent],
  declarations: [ScheduledInfiniteScrollListComponent],
  providers: [ScheduleUtils, AssesmentsUtil,WebSocketService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ScheduledInfiniteScrollListModule { }
