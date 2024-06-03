import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ListScheduledAssessmentComponent } from './list-scheduled-assessment.component';
import { ListScheduledAssessmentRoutingModule } from './list-scheduled-assessment-routing.module';
import { SearchModule } from 'src/app/shared/search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduledInfiniteScrollListModule } from './scheduled-assessment-infinite-scroll-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  imports: [
    CommonModule,
    ListScheduledAssessmentRoutingModule,
    SearchModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    ScheduledInfiniteScrollListModule,
    MatIconModule,
    MatTooltipModule

  ],
  exports: [ListScheduledAssessmentComponent],
  declarations: [ListScheduledAssessmentComponent],
  providers: [DatePipe]
})
export class ListScheduledAssessmentModule { }
