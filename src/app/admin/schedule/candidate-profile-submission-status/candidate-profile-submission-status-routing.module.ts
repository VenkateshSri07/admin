import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CandidateProfileSubmissionStatusComponent} from './candidate-profile-submission-status.component'
const CandidateProfileSubmissionStatusRoutes: Routes = [
  {
    path: '',
    component: CandidateProfileSubmissionStatusComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(CandidateProfileSubmissionStatusRoutes)],
  exports: [RouterModule]
})
export class CandidateProfileSubmissionStatusRoutingModule {}
