import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateSchedulePackageComponent } from './create-schedule-package.component';
import { CreateSchedulePackageRoutingModule } from './create-schedule-package-routing.module';
// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AdminUtils } from '../../admin.utils';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { registerLocaleData } from '@angular/common';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import en from '@angular/common/locales/en';
registerLocaleData(en);
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
@NgModule({
  imports: [
    CreateSchedulePackageRoutingModule,
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
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    NzSelectModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule,
    NzModalModule,
    NzAutocompleteModule,
    NzInputNumberModule
  ],
  exports: [CreateSchedulePackageComponent],
  declarations: [CreateSchedulePackageComponent],
  providers: [AdminUtils, GlobalValidatorService,
    { provide: NZ_I18N, useValue: en_US }]
})
export class CreateScheduleAssessmentPackageModule { }
