import { CandidateFormComponent } from './candidate-form/candidate-form.component'
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GeneralInstructionsComponent} from './general-instructions/general-instructions.component'

const routes: Routes = [
  {
    path: `candidate`, component: CandidateFormComponent
  },
  {
    path:`generalinstructions`,component:GeneralInstructionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
