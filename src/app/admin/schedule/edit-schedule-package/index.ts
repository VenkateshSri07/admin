import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AdminUtils } from '../../admin.utils';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditSchedulePackageComponent } from './edit-schedule-package.component';
import { EditSchedulePackageRoutingModule } from './edit-schedule-package-routing.module';
import { MatRadioModule } from '@angular/material/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
@NgModule({
  imports: [
    EditSchedulePackageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
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
    MatRadioModule,
    MatSnackBarModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule,
    NzModalModule,
    NzSelectModule,
    NzInputNumberModule
  ],
  exports: [EditSchedulePackageComponent],
  declarations: [EditSchedulePackageComponent],
  providers: [AdminUtils]
})
export class EditScheduleAssessmentPackageModule { }
