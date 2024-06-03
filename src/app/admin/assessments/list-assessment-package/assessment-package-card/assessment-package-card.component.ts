import { Component, Input, OnInit } from '@angular/core';
import { AssesmentsUtil } from '../../assessments.common.utils';
import {
  AssesmentPackagesModel,
  TaskModel
} from 'src/app/rest-api/package-api/model/package-response.model';
import { AssessmentsReducerState } from '../../redux/assessments.model';
import { Store } from '@ngrx/store';
import * as assessmentActions from '../../redux/assessments.actions';
import { AssessmentsModuleEnum } from '../../assessments.enums';
import { Router } from '@angular/router';
@Component({
  selector: 'app-assessment-package-card',
  templateUrl: 'assessment-package-card.component.html',
  styleUrls: ['assessment-package-card.component.scss']
})
export class AssessmentPackageCardComponent implements OnInit {
  public testList: any;
  keywords: any;
  @Input() packageContent: AssesmentPackagesModel;
  @Input() tasks: TaskModel[];
  @Input() canViewPackage: boolean;
  constructor(
    public assesmentsUtil: AssesmentsUtil,
    public router:Router,
    private store: Store<AssessmentsReducerState>
  ) { }
  ngOnInit(): void {
    let arr = []
    arr.push(this.tasks)
    // console.log(this.tasks, 'arr')
    this.createSubHeaderText();

  }


  onEditDeatils(value) {
    this.router.navigate([`/admin/assessments/view/${value}/edit`])
    // /admin/assessments/view/{{ packageContent.id }}/edit
    // this.router.navigate(['/admin/schedule/edit'], { state: { data: assessments } });
    // this.sendData.sendMessage(assessments);
  }

  createSubHeaderText() {
    const taskTypeAndCount = new Map<string, number>();
    // console.log(this.tasks, 'task');
    this.tasks.forEach((task) => {
      const count = taskTypeAndCount.get(task.type);
      if (count) {
        taskTypeAndCount.set(task.type, count + 1);
      } else {
        taskTypeAndCount.set(task.type, 1);
      }
    });
    const taskString = new Array<string>();
    taskTypeAndCount.forEach((value, key) => {
      this.testList = taskString.push(value + ' ' + key + ' ' + '');
    });

    return taskString.join('');
  }




  archiveAssessmentPackage(): void {
    this.store.dispatch(
      assessmentActions.initPatchAssessmentPackageStatus({
        payload: {
          data: {
            id: this.packageContent.id.toString(),
            fields: ['STATUS'],
            attributes: {
              status: AssessmentsModuleEnum.ArchivedAssessmentStatus
            }
          },
          navigateToAssessmentListPage: false
        }
      })
    );
  }
  deleteAssessmentPackage(): void {
    this.store.dispatch(
      assessmentActions.initDeleteAssessmentPackage({
        payload: {
          packageTemplateId: this.packageContent.id
        }
      })
    );
  }
}
