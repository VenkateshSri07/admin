import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchCodeComponent } from '../shared/search-code/search-code.component';
import { AssessmentComponent } from './assessment.component';

const AssessmentRoutes: Routes = [
  {
    path: '',
    component: AssessmentComponent,
    children: [
      {
        path: 'assessment/:id',
        loadChildren: () =>
          import('./landing-page/index').then((module) => module.LandingPageModule)
      },
      {
        path: 'assessmentsearch',
        component: SearchCodeComponent
      },
      {
        path: 'SystemReadinessCheck',
        loadChildren: () =>
          import('./system-readiness-check/index').then((module) => module.SystemReadinessCheckModule),
      },

      {
        path: 'TestInformation',
        loadChildren: () =>
          import('./test-information/index').then((module) => module.TestInformationModule),

      },
      {
        path: 'VideoAssesment',
        loadChildren: () =>
          import('./video-interview/index').then((module) => module.VideoInterviewModule),

      },

    ]


  },

];
@NgModule({
  imports: [RouterModule.forChild(AssessmentRoutes)],
  exports: [RouterModule]
})
export class AssessmentRoutingModule { }
