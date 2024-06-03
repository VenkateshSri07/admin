import { NavigationStart, Router, NavigationExtras } from '@angular/router';
import { UserAPIService } from 'src/app/rest-api/user-api/user-api.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { LoadingService } from './../../rest-api/loading.service';
import { Store } from '@ngrx/store';
import { assessmentIDAction } from 'src/app/login/redux/login.actions';
import { SentData } from 'src/app/rest-api/sendData';
import { AssessmentTasksReducerState } from 'src/app/assessment/landing-page/redux/landing-page.model';
import { selectUserProfileData } from 'src/app/redux/user/user.reducer';
import { WebSocketService } from 'src/app/rest-api/web-socket/web-socket.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'uap-search-code',
  templateUrl: './search-code.component.html',
  styleUrls: ['./search-code.component.scss']
})
export class SearchCodeComponent implements OnInit {
  @ViewChild('multiLogin', { static: false }) multiLogin: TemplateRef<any>;

  assessmentCode: any;
  scheduleId: any;
  assessmentId: any;
  isAssessCode: boolean = false;
  btnshow: boolean;
  url: string;
  getUser: any;
  constructor(
    private router: Router,
    private store: Store<AssessmentTasksReducerState>,
    private toast: ToastrService,
    private _loading: LoadingService,
    private api: UserAPIService,
    private sendData: SentData,
    private userService: UserAPIService,
    public websocket: WebSocketService,
    public dialog: MatDialog

  ) {

    this._loading.setLoading(false, 'request.url');
    this.isAssessCode = sessionStorage.getItem('assessmentId') && sessionStorage.getItem('assessmentId') != "" && sessionStorage.getItem('assessmentId') != undefined ? false : true
    if (!this.isAssessCode) {
      this.router.navigate(['/landing/assessment', sessionStorage.getItem('assessmentId')]);
    }
  }
  ngOnInit(): void {
    // this.socketProgres();
    // this.isBacklogin();
    // this.checkUserLoginActivity();
  }

  userredirectTo(): any {
    this.getUser = JSON.parse(sessionStorage.getItem('user'))
    return this.getUser?.attributes?.organisations[0]?.roles[0]?.roleCode;
  }

  getCode() {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    var email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : '';
    let data = {
      email: email,
      assessmentCode: this.assessmentCode
    }
    this.api.SearchCode(data).subscribe((res: any) => {
      if (res.success) {
        this.scheduleId = res.data.scheduleId;
        this.assessmentId = res.data.id;
        var loginReq = {
          scheduleId: res.data.scheduleId,
          assessmentCode: this.assessmentCode,
          loginId: sessionStorage.getItem("loginId"),
          email: email
        }
        // this.api.checkuserloginWithScheduleId(loginReq).subscribe((loginRes: any) => {
        //   if (loginRes.success) {
            // if (loginRes && loginRes.message == 'You are logged-in already. Please contact admin team') {
            //   this.dialog.open(this.multiLogin, {
            //     width: '500px',
            //     height: '273px',
            //     disableClose: true
            //   })
            // } else {
              // var attemptObj = {scheduleId: res.data.scheduleId.toString(),email: email};
              // this.api.candidateAttemptCountUpdateAPI(attemptObj).subscribe((loginRes: any) => {
              // });
              localStorage.setItem('assessmentTestCode', this.assessmentCode);
              localStorage.setItem('scheduleId', res.data.scheduleId);
              if (res.data.formStatus != undefined) {
                if (res.data.formStatus == true) {
                  if (res.data.instructionFlag == 0) {
                    this.assessmentCode = '';
                    sessionStorage.setItem('assessmentId', res.data.id)
                    let getAssessId = sessionStorage.getItem('assessmentId');
                    if (getAssessId) {
                      sessionStorage.removeItem('routeTo');
                      this.store.dispatch(assessmentIDAction({ id: getAssessId }));
                      return this.router.navigate(['/landing/assessment', getAssessId]);
                    }
                    else {
                      this.toast.error("Assessment Id not found");
                    }
                  } else {
                    this.assessmentCode = '';
                    sessionStorage.setItem('assessmentId', res.data.id)
                    return this.router.navigate(['/uapcandidate/generalinstructions'], { replaceUrl: true })
                  }
                } else {
                  if (res.data.instructionFlag == 0) {
                    localStorage.setItem('assessmentIdCode', res.data.id)
                    localStorage.setItem("orgId", res.data.orgId);
                    localStorage.setItem("formtemplate", res.data.formTemplateId)
                    localStorage.setItem("details", JSON.stringify(res.data.formFilledData[0]))
                    return this.router.navigateByUrl('/uapcandidate/candidate');
                  } else {
                    localStorage.setItem('assessmentIdCode', res.data.id)
                    localStorage.setItem("orgId", res.data.orgId);
                    localStorage.setItem("formtemplate", res.data.formTemplateId)
                    localStorage.setItem("details", JSON.stringify(res.data.formFilledData[0]))
                    return this.router.navigate(['/uapcandidate/generalinstructions'])
                  }
                }
              } else {
                this.assessmentCode = '';
                sessionStorage.setItem('assessmentId', res.data.id)
                if (res.data.instructionFlag == 0) {
                  let getAssessId = sessionStorage.getItem('assessmentId');
                  if (getAssessId) {
                    sessionStorage.removeItem('routeTo');
                    this.store.dispatch(assessmentIDAction({ id: getAssessId }));
                    return this.router.navigate(['/landing/assessment', getAssessId]);
                  }
                  else {
                    this.toast.error("Assessment Id not found");
                  }
                } else {
                  return this.router.navigate(['/uapcandidate/generalinstructions'])
                }
              }
            // }
        //   } else {
        //     this.toast.success(loginRes.message);
        //   }
        // })

      }
      else {
        this.toast.error(res.message);
      }
    })

  }

  isBacklogin() {
    let permission = this.userredirectTo();
    if (permission && permission == 'AST') {
      this.router.events.subscribe((event: NavigationStart) => {
        console.log("--event.url-->", event)
        permission = this.userredirectTo();

        if (event && event.url && event.url != "/profile" || event.url.indexOf('/landing/assessment') == -1) {
          console.log("event.url.includes('/landing/assessment')", event.url.indexOf('/landing/assessment'))
          if (event.navigationTrigger === 'popstate' && event.url != "/landing/assessmentsearch" && permission && permission == 'AST') {
            var checkStatus: any = window.confirm('Are you Sure You want to logout from this page')
            if (checkStatus == true) {
              sessionStorage.removeItem('assessmentId');
              this.userService.logout();
            }
            else {
              // sessionStorage.removeItem('assessmentId');
              // this.router.navigate(['/landing/assessmentsearch']);
            }
          }
        }
      });

    }
  }

  socketProgres() {
    // this.websocket.listen('clearMultiUserSection').subscribe(async (res: any) => {
    //   const userProfile = JSON.parse(sessionStorage.getItem('user'));
    //   let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
    //   const roleCode = await this.getUserRoleCode();
    //   if (email == res && roleCode == 'AST') {
    //     sessionStorage.removeItem('assessmentId');
    //     this.api.logout();
    //     this.toast.error("Your session has been successfully activated in another system. If you want to log in again, please ensure that your current session is cleared before proceeding. Thank you.");
    //   }
    // });
    this.websocket.listen('clearMultiUserWithScheduleId').subscribe(async (res: any) => {
      const userProfile = JSON.parse(sessionStorage.getItem('user'));
      let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
      const roleCode = await this.getUserRoleCode();
      var assessmentTestCode = localStorage.getItem("assessmentTestCode");
      var scheduleId = localStorage.getItem("scheduleId");
      if (email == res.email && roleCode == 'AST' && assessmentTestCode == res.assessmentCode && scheduleId == res.scheduleId) {
        sessionStorage.removeItem('assessmentId');
        this.api.logout();
        this.toast.error("Your session has been successfully activated in another system. If you want to log in again, please ensure that your current session is cleared before proceeding. Thank you.");
      }
    });
  }
  // Getting User Role Code
  getUserRoleCode() {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    return userProfile && userProfile.attributes && userProfile.attributes.organisations &&
      userProfile.attributes.organisations[0] && userProfile.attributes.organisations[0].roles &&
      userProfile.attributes.organisations[0].roles[0] ? userProfile.attributes.organisations[0].roles[0].roleCode : ''
  }

  checkUserLoginActivity() {
    var loginId = sessionStorage.getItem("loginId");
    this.api.checkCurrentUserLoginApi({ loginId: loginId }).subscribe(async (resData: any) => {
      if (resData.success) {
        if (resData.data.isActive == false) {
          const roleCode = await this.getUserRoleCode();
          if (roleCode == 'AST') {
            sessionStorage.removeItem('assessmentId');
            this.api.logout();
            this.toast.error("Session has been cleared, Please try to login again");
          }
        }
      } else {
        console.log("User login not found")
      }
    });
  }

  clearPopUp() {
    this.dialog.closeAll();
  }


  exitActiveSystem() {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
    this.api.exitActiveSystem({ emailId: email, type: "Paused", assessmentId: this.assessmentId }).subscribe((data: any) => {
    })
  }

  clearUserSession() {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
    var loginReq = {
      scheduleId: this.scheduleId,
      assessmentCode: this.assessmentCode,
      email: email
    }
    this.api.clearMultiUserSectionwithScheduleId(loginReq).subscribe((data: any) => {
      if (data.success) {
        this.dialog.closeAll();
        this.toast.success("Session has been cleared, Please search with same assessment code again.");
        // this.exitActiveSystem();
        localStorage.removeItem('scheduleId')
        localStorage.removeItem('assessmentTestCode')
      } else {
        this.toast.success("Unable to clear the session, Please try again later.");
      }
    });

  }
}
