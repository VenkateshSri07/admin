import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CandidateSheduleComponent } from './candidate-shedule.component';
import { CreateSchedulePackageRoutingModule } from './candidate-schedule-routing.module';
// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AdminUtils } from '../../admin.utils';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../../material/material.module';
import { CandidateViewComponent } from './candidate-view/candidate-view.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { InstructionScheduleComponent } from './instruction-schedule/instruction-schedule.component';
import { CandidateSyncDetailsComponent } from './candidateSyncDetails/candidateSyncDetails.component';
import { BrowserModule } from '@angular/platform-browser';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NgxSummernoteModule } from 'ngx-summernote';
import { CandidateSendEmailComponent } from './candidate-send-email/candidate-send-email.component'
@NgModule({
  imports: [
    CreateSchedulePackageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    // CommonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    // NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    NgxFileDropModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MaterialModule,
    MatPaginatorModule,
    MatSortModule,
    AngularEditorModule,
    NzSelectModule,
    NgxSummernoteModule,
    BrowserModule
  ],
  exports: [CandidateSheduleComponent],
  declarations: [CandidateSheduleComponent, CandidateViewComponent, InstructionScheduleComponent, CandidateSyncDetailsComponent, CandidateSendEmailComponent],
  providers: [AdminUtils]
})
export class CandidateScheduleAssessmentPackageModule { }
