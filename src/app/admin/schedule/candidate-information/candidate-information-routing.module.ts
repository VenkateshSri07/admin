import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CandidateInformationComponent } from './candidate-information.component';

const CandidateInformationRouts: Routes = [
    {
        path: '',
        component: CandidateInformationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(CandidateInformationRouts)],
    exports: [RouterModule]
})
export class CandidateInformationroutingModule { }