import { CustomSnackBarModule } from './shared/custom-snack-bar-content/index';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_IMPORTS } from './app.imports';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PrivilegeGuard } from './privilege.guard';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from './material/material.module';
import { PrivilegeAutoLogoutGuard } from './privilege-auto-logout.guard';
import { InterceptorService } from './interceptor.service';
import { ScreenresolutionBoxComponent } from './shared/screenresolution-box/screenresolution-box.component';
import { CdTimerModule } from 'angular-cd-timer';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AddcriteriaComponent } from './admin/schedule/candidate-shedule-common/addcriteria/addcriteria.component';
import { FormsModule } from '@angular/forms';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
registerLocaleData(en);
const ngZorroConfig: NzConfig = {
  message: { nzTop: 24, nzMaxStack: 1 },
  notification: { nzTop: 240 }
};
@NgModule({
  declarations: [AppComponent, ScreenresolutionBoxComponent, AddcriteriaComponent],
  imports: [
    CdTimerModule,
    APP_IMPORTS,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule,
    CustomSnackBarModule,
    HttpClientModule,
    AngularEditorModule,
    NzMessageModule,

    ToastrModule.forRoot(
      {
        timeOut: 3000,
        preventDuplicates: true,
        maxOpened: 3,
        autoDismiss: true,
        progressBar: true,
        progressAnimation: 'increasing',
        // closeButton:true
      }
    ),
    FormsModule,
  ],
  providers: [PrivilegeGuard, PrivilegeAutoLogoutGuard,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
