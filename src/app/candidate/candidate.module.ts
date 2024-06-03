import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../material/material.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateFormComponent } from './candidate-form/candidate-form.component';
import { CandidateRoutingModule } from './candidate-routing.module'
import { MatInputModule } from '@angular/material/input';
import { NavBarModule } from '../shared/navbar';
import { GeneralInstructionsComponent } from './general-instructions/general-instructions.component';
// import { VerificationcodeComponent } from './verificationcode/verificationcode.component';

@NgModule({
  declarations: [CandidateFormComponent, GeneralInstructionsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    MatInputModule,
    FormsModule,
    NavBarModule,
    ReactiveFormsModule,
    CandidateRoutingModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CandidateModule { }
