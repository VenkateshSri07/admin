import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../rest-api/loading.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserAPIService } from 'src/app/rest-api/user-api/user-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LocationStrategy } from '@angular/common';
import { WebSocketService } from 'src/app/rest-api/web-socket/web-socket.service';

@Component({
  selector: 'uap-general-instructions',
  templateUrl: './general-instructions.component.html',
  styleUrls: ['./general-instructions.component.scss'],
})
export class GeneralInstructionsComponent implements OnInit {

  formId: any;
  scheduleId: any;
  htmlTemplate:any;
  getUser: any;

  constructor(
    private _loading: LoadingService,
    private route: Router,
    private api: UserAPIService,
    private toast: ToastrService,
    public sanitizer: DomSanitizer,
    private location: LocationStrategy,
    public websocket: WebSocketService

  ) {
    var scheduleId = localStorage.getItem('scheduleId');
    if(scheduleId == null ||  scheduleId == undefined || scheduleId.length == 0 ){
      this.api.logout();
    }
   }

  ngOnInit(): void {
    // this.socketProgres();
    this.isBacklogin();
    // this.checkUserLoginActivity();
    this._loading.setLoading(false, 'request.url');
    this.formId = localStorage.getItem("formtemplate");
    this.scheduleId = localStorage.getItem("scheduleId")
    this.instructionFetch();
  }

  instructionFetch() {
    let data = {
      scheduleId: this.scheduleId
    }
    this.api.getInstruction(data).subscribe((res: any) => {
      if (res.success) {
        this.htmlTemplate = this.sanitizer.bypassSecurityTrustHtml(res.data[0].instructionHtml)
      }
      else {
        this.toast.error(res.message);
      }
    })
  }

  nextPage() {
    if (this.formId != null && this.formId != undefined && this.formId != '') {
      this.route.navigate(['/uapcandidate/candidate']);
    } else {
      // login effect
      let getId = sessionStorage.getItem('routeTo');
      let getAssessId = sessionStorage.getItem('assessmentId');
      if (getId) {
        // sessionStorage.removeItem('assessmentId');
        return this.route.navigate(['/landing/assessment', getId]);
      }
      if (getAssessId) {
        sessionStorage.removeItem('routeTo');
        return this.route.navigate(['/landing/assessment', getAssessId]);
      }
      this._loading.setLoading(false, 'request.url');
      return this.route.navigate(['/unauthorized']);
    }
  }

  userredirectTo(): any {
    this.getUser = JSON.parse(sessionStorage.getItem('user'))
    return this.getUser?.attributes?.organisations[0]?.roles[0]?.roleCode;
  }

  isBacklogin() {
    let permission = this.userredirectTo();
    if (permission && permission == 'AST') {
      history.pushState(null, null, window.location.href);
      // check if back or forward button is pressed.
      this.location.onPopState(() => {
          history.pushState(null, null, window.location.href);
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
      var assessmentTestCode =  localStorage.getItem("assessmentTestCode");
      var scheduleId = localStorage.getItem("scheduleId");
      if (email == res.email && roleCode == 'AST' && assessmentTestCode == res.assessmentCode && scheduleId ==res.scheduleId ) {
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

}
