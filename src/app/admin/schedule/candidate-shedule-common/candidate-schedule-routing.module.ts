import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateSheduleComponent } from './candidate-shedule.component';

const CandidateSchedulePackageRoutes: Routes = [
  {
    path: '',
    component: CandidateSheduleComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(CandidateSchedulePackageRoutes)],
  exports: [RouterModule]
})
export class CreateSchedulePackageRoutingModule {}
