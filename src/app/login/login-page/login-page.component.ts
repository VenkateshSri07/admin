import { AppState } from './../../reducers/index';
import { Store } from '@ngrx/store';
import { UserAPIService } from './../../rest-api/user-api/user-api.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { assessmentIDAction, loginAttempt, logoutAction } from '../redux/login.actions';
import { ActivatedRoute, Router } from '@angular/router';
import browser from 'browser-detect';
import { HttpClient } from '@angular/common/http';
import * as publicIp from 'public-ip';
import { SentData } from 'src/app/rest-api/sendData';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'uap-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  @ViewChild('multiLogin', { static: false }) multiLogin: TemplateRef<any>;

  userIP = '';
  loginForm: FormGroup;
  hide = true;
  show = false;
  disableButton: boolean;
  errorMessage: any;
  assessmentId: any;
  browserDetails: any;
  checkRouter: string;
  isAssessCode = false;
  currentYear: number | undefined;
  assessmentTestCode: any;
  assessmentTestId: any;
  scheduleId: any;
  constructor(
    public fb: FormBuilder,
    public toastr: ToastrService,
    private api: UserAPIService,
    private router: ActivatedRoute,
    private store: Store<AppState>,
    private httpClient: HttpClient,
    private router1: Router,
    private sendData: SentData,
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.getRouterUrl();
    this.loadIp();
    this.getAssessmentParam();
    this.formInitialize();
    // this.getErrorMessage();
    localStorage.setItem("smallScreen", 'false')

    //for single login
    // this.sendData.getMessage().subscribe((data) => {
    //   if (data.key == "multiLoginCheck") {
    //     if (data.value == true) {
    //       this.dialog.open(this.multiLogin, {
    //         width: '400px',
    //         height: '165px',
    //         disableClose: true
    //       })
    //     }
    //   }
    // })

    this.sendData.getMessage().subscribe((data) => {
      if (data.key == "multiLoginCheck") {
        if (data.value.modelOpen == true) {
          this.scheduleId = data.value.scheduleId;
          this.assessmentTestCode = data.value.assessmentTestCode;
          this.assessmentTestId = data.value.assessmentId

          this.dialog.open(this.multiLogin, {
            width: '481px',
            height: '220px',
            disableClose: true
          })
        }
      }
    })
  }

  getRouterUrl() {
    this.checkRouter = this.router1.url;
    if (this.checkRouter == '/login') {
      this.isAssessCode = true;
      localStorage.setItem("Candidate", "true")
    } else {
      this.isAssessCode = false;
      localStorage.setItem("Candidate", "false")
    }
  }

  getAssessmentParam() {
    this.router.queryParams.subscribe((param: any) => {
      let params = param;
      sessionStorage.clear();
      if (params && params.assessmentId) {
        this.assessmentId = params.assessmentId;
        localStorage.setItem("Candidate", "true")
        sessionStorage.setItem('assessmentId', this.assessmentId);
        this.store.dispatch(assessmentIDAction({ id: this.assessmentId }));
      }
    });
  }

  getErrorMessage() {
    // this.store.select(getUserProfileFailure).subscribe((data: any)=> {

    // });
  }


  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      // assessmentCode: [''],
    })
  }


  login() {
    sessionStorage.removeItem('token');
    if (this.loginForm.valid) {
      let ipInfo = {
        ip: this.userIP,
        name: this.browserDetails.name,
        os: this.browserDetails.os,
        version: this.browserDetails.version,
        versionNumber: this.browserDetails.versionNumber
      }

      let apiData = {
        email: this.loginForm.value.username.trim(),
        pass: this.loginForm.value.password.trim(),
        assessmentCode: this.loginForm.value.assessmentCode ? this.loginForm.value.assessmentCode.trim() : "",
        assessmentId: sessionStorage.getItem('assessmentId') ? sessionStorage.getItem('assessmentId') : '',
        browserinfo: ipInfo,
      }
      this.store.dispatch(loginAttempt({ payload: apiData }));
      sessionStorage.setItem('enableFinish', "false")
    } else {
    }
  }


  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

  loadIp() {
    publicIp.v4().then((ip) => {
      this.userIP = ip ? ip : '';
      this.browserDetails = browser();
    });
  }

  //for single login
  // clearPopUp() {
  //   this.dialog.closeAll();
  // }


  // exitActiveSystem() {
  //   this.api.exitActiveSystem({ emailId: this.loginForm.value.username.trim() }).subscribe((data: any) => {
  //   })
  // }

  // clearUserSession() {
  //   this.api.clearMultiUserSection({ email: this.loginForm.value.username.trim() }).subscribe((data: any) => {
  //     if (data.success) {
  //       this.dialog.closeAll();
  //       this.toastr.success("Session has been cleared, Please try to login again.");
  //       this.exitActiveSystem();
  //     } else {
  //       this.toastr.success("Unable to clear the session, Please try again later.");
  //     }
  //   });
  // }

  clearPopUp() {
    localStorage.clear();
    sessionStorage.clear();
    this.dialog.closeAll();
  }
  exitActiveSystem() {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
    this.api.exitActiveSystem({ emailId: this.loginForm.value.username.trim(), type: "Paused", assessmentId: this.assessmentTestId }).subscribe((data: any) => {
    })
  }

  clearUserSession() {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
    var loginReq = {
      scheduleId: this.scheduleId,
      assessmentCode: this.assessmentTestCode,
      email: email
    }
    this.api.clearMultiUserSectionwithScheduleId(loginReq).subscribe((data: any) => {
      if (data.success) {
        this.dialog.closeAll();
        this.toastr.success("Session has been cleared, Please try to login again.");
        this.exitActiveSystem();
        localStorage.clear();
        sessionStorage.clear();
      } else {
        this.toastr.success("Unable to clear the session, Please try again later.");
      }
    });
  }

}
