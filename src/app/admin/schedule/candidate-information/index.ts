import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateInformationroutingModule } from './candidate-information-routing.module';
import { CandidateInformationComponent } from './candidate-information.component';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CandidateSendEmailComponent } from '../candidate-shedule-common/candidate-send-email/candidate-send-email.component';
@NgModule({
    imports: [
        CommonModule,
        CandidateInformationroutingModule,
        AgGridModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        NzInputModule,
        NzIconModule,
        NzButtonModule,
        MatDialogModule],
    exports: [CandidateInformationComponent],
    declarations: [CandidateInformationComponent],
    providers: []
})
export class CandidateInformationModule { }