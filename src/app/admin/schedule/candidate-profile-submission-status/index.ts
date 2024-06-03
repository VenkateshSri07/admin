import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateProfileSubmissionStatusRoutingModule } from './candidate-profile-submission-status-routing.module';
import { CandidateProfileSubmissionStatusComponent } from './candidate-profile-submission-status.component';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
// import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
@NgModule({
    imports: [
        CommonModule,
        CandidateProfileSubmissionStatusRoutingModule,
        AgGridModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        // MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        NzInputModule
    ],
    exports: [CandidateProfileSubmissionStatusComponent],
    declarations: [CandidateProfileSubmissionStatusComponent],
    providers: []
  })
  export class CandidateProfileSubmissionStatusModule { }