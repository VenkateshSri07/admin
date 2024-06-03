import { AppState } from 'src/app/reducers';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UapHttpService } from '../uap-http.service';
import { UserProfileResponseModel } from './models/user-profile.model';
import { CustomSnackBarContentComponent } from 'src/app/shared/custom-snack-bar-content/custom-snack-bar-content.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { logoutAction } from 'src/app/login/redux/login.actions';
import { selectUserProfileData } from 'src/app/redux/user/user.reducer';
import { AnyNaptrRecord } from 'dns';
import { SentData } from '../sendData';

@Injectable()
export class UserAPIService {
  NODEBASEURL = environment.NODE_URL;
  constructor(private httpClient: UapHttpService, private http: HttpClient, private snackBar: MatSnackBar,
    private toastr: ToastrService, private route: Router, private store: Store<AppState>, private sendData: SentData

  ) { }
  getUserProfile(): Observable<UserProfileResponseModel> {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    let data = {
      email: userProfile && userProfile.attributes && userProfile.attributes.email
    }
    return this.httpClient.post<UserProfileResponseModel>(`/profile`, data);
  }

  SearchCode(data: any) {
    return this.httpClient.postNode(`/searchAssessment`, data)
  }
  login(data: any) {
    return this.httpClient.post(`/loginuapnew`, data)
  }

  getTokenFromParamForLogin(data: any) {
    return this.httpClient.post(`/getUserToken`, data)
  }

  exitOtherSystem(data: any) {
    return this.httpClient.postNode(`/exitOtherSystem`, data)
  }

  resultNotification() {
    return this.httpClient.postNode(`/getEmailTemplateForResult`, '')
  }

  getCampusDriveList(data) {
    return this.httpClient.postNode(`/driveList`, data)
  }

  getAssessmentFormToUse() {
    return this.httpClient.postNode(`/getFeedbackForms`, '')
  }

  // Add criteria api
  getCriteria() {
    // return this.httpClient.get('/getCriteria')
    return this.httpClient.post('/getCriteria', {})

  }

  // Campus API

  stateSync(data: any) {
    return this.httpClient.postNode(`/statelistsync`, data)
  }

  districtSync(data: any) {
    return this.httpClient.postNode(`/districtlistsync`, data)
  }

  collegeSync(data: any) {
    return this.httpClient.postNode(`/collegelistsync`, data)
  }

  driveSync(data: any) {
    return this.httpClient.postNode(`/drivelistsync`, data)
  }

  // candidate display api

  candidateDisplayForm(data: any) {
    return this.httpClient.post(`/getCandidateForms`, data)
  }
  // candidate casecade dropdown

  stateList(data: any) {
    return this.httpClient.postNode('/stateList', data);
  }

  districtList(data: any) {
    return this.httpClient.postNode('/districtList', data);
  }

  collegeList(data: any) {
    return this.httpClient.postNode('/collegeList', data);
  }

  // candidate profile submit api

  candidateProfile(data) {
    return this.httpClient.postNode('/candidateProfile', data)
  }

  fileUpload(data) {
    return this.httpClient.postNodeWithMultipartDataHeaders('/uploadFile', data)
  }



  //OTP Verification of candidate Form
  generateOTP(data: any) {
    return this.httpClient.postNode(`/generate-otp`, data)
  }

  validateOTP(data: any) {
    return this.httpClient.postNode(`/validate-otp`, data)
  }

  getInstruction(data: any) {
    return this.httpClient.postNode('/getinstructionbyscheduleid', data)
  }

  getAssessmentTaskCriteria(data: any) {
    return this.httpClient.postNode(`/getassessmenttaskcriteria`, data)
  }

  updateTaskCard(data: any) {
    return this.httpClient.postNode(`/updateTask`, data)
  }

  getAssessmentResultApi(data: any) {
    return this.httpClient.postNode(`/getassessmentresults`, data)
  }

  getResultSyncApi(data: any) {
    return this.httpClient.postNode(`/resultsync`, data)
  }

  syncTerminateAPI(data: any) {
    return this.httpClient.postNode(`/terminateDelivery`, data)
  }

  syncStatusAPI(data: any) {
    return this.httpClient.postNode(`/getDeliveryDetail`, data)
  }

  getAssessmentScoreApi(data: any) {
    return this.httpClient.postNode(`/getassessmentscore`, data)
  }
  assessmentScoreCampusSync(data: any) {
    return this.httpClient.postNode(`/assessmentscoresyncforcampus`, data)
  }
  updateCurrentAssessmentSync(data: any) {
    return this.httpClient.postNode(`/updatecurrentassessment`, data)
  }

  getSpecializationApi(data: any) {
    return this.httpClient.postNode(`/getSpecialization`, data)
  }

  getDegreeApi(data: any) {
    return this.httpClient.postNode(`/getdegree`, data)
  }

  getCandidateDetailsAPI(data: any) {
    return this.httpClient.postNode(`/getcandidateDetails`, data)
  }

  updatedCandidateFormAPI(data: any) {
    return this.httpClient.postNode(`/updateCandidateForm`, data)
  }

  clearMultiUserSection(data: any) {
    return this.httpClient.postNode(`/clearMultiUser`, data)
  }
  exitActiveSystem(data: any) {
    return this.httpClient.postNode(`/exitActiveSystem`, data)
  }
  checkCurrentUserLoginApi(data: any) {
    return this.httpClient.postNode(`/checkCurrentUserLogin`, data)
  }

  checkuserloginWithScheduleId(data: any) {
    return this.httpClient.postNode(`/checkuserloginWithScheduleId`, data)
  }

  clearMultiUserSectionwithScheduleId(data: any) {
    return this.httpClient.postNode(`/clearMultiUserWithScheduleId`, data)
  }

  candidateAttemptCountUpdateAPI(data: any) {
    return this.httpClient.postNode(`/candidateAttemptCountUpdate`, data)
  }

  getCurrentTime(){
    return this.httpClient.getNode(`/getCurrentTime`);
  }

  isValidUser(data: any) {
    if (data && data.data && data.token) {
      sessionStorage.setItem('user', JSON.stringify(data.data));
      sessionStorage.setItem('token', data.token.access_token ? data.token.access_token : '');
      sessionStorage.setItem('refresh_token', data.token.refresh_token ? data.token.refresh_token : '');
      sessionStorage.setItem('loginId', data.data.loginId);
      return true;
    } else {
      this.mulitpleUserLoginToast(data);
      return false;
    }
  }

  mulitpleUserLoginToast(data) {
    if (data && data.exist_login) {
      this.toastr.warning(data && data.message ? data.message : 'You are already logged in...');
    } else {
      if (data.message && data.message.error_description) {
        this.toastr.warning(data && data.message ? data.message.error_description : 'Invalid Login Credentials');
      } else { 
        //commented for single time login
        // if (data && data.message == 'You are logged-in already. Please contact admin team') {
        //   var obj = {
        //     key: "multiLoginCheck",
        //     value: true
        //   }
        //   this.sendData.sendMessage(obj);
        // } else {
          this.toastr.warning(data && data.message ? data.message : 'Invalid Login Credentials');
        // }
      }
    }
  }

  getUserFromLocalStorage() {
    let users: any = sessionStorage.getItem('user');
    return JSON.parse(users);
  }

  getReferenceFromLocalStorage() {
    let reference: any = sessionStorage.getItem('reference');
    return JSON.parse(reference);
  }

  logout() {
    let permission = this.userredirectTo();
    if (permission && permission == 'AST') {
      let email = sessionStorage.getItem('user') ? (JSON.parse(sessionStorage.getItem('user')) && JSON.parse(sessionStorage.getItem('user')).attributes && JSON.parse(sessionStorage.getItem('user')).attributes.email ? JSON.parse(sessionStorage.getItem('user')).attributes.email : '') : '';
      email ? this.logoutWhenTokenNotPresent() : this.logoutWhenTokenNotPresent();
      sessionStorage.clear();
    } else {
      this.logoutWhenTokenNotPresent();
    }
  }

  logoutForTestTaker(email) {
    //for single login
   // this.exitOtherSystem({ email }).subscribe((response: any) => {
    var obj ={
      email:email,
      scheduleId:localStorage.getItem("scheduleId"),
      assessmentCode:localStorage.getItem("assessmentTestCode"),
      type:"logout"
    }
    this.clearMultiUserSectionwithScheduleId(obj).subscribe((response: any) => {
      if (response && response.success) {
        this.logoutWhenTokenNotPresent();
      } else {
        // this.toastr.warning(response && response.message ? response.message : 'Try again later');
        this.logoutWhenTokenNotPresent();
      }
    }, (err) => {

    });
  }

  logoutWhenTokenNotPresent() {
    let validateRole = localStorage.getItem('Candidate');
    if (validateRole === 'true') {
      this.route.navigate(['/login']);
      sessionStorage.clear();
      localStorage.clear();
    } else {
      this.route.navigate(['/login/admin']);
      sessionStorage.clear();
      localStorage.clear();

    }
    this.store.dispatch(logoutAction());
  }


  userredirectTo(): any {
    let permission;
    this.store.select(selectUserProfileData).subscribe((data: any) => {
      permission = data.attributes.organisations[0].roles[0].roleCode;
    });
    return permission;
  }

  openSnackBar(message: string | undefined): void {
    const snackBarRef = this.snackBar.openFromComponent(CustomSnackBarContentComponent, {
      duration: 2000,
      data: {
        displayMessage: '',
        errorMessage: message,
        errorCode: 400
      },
      verticalPosition: 'top',
      panelClass: ['snackbar']
    });
  }


  getScheduleDetails(data: any) {
    return this.httpClient.postNode(`/getscheduledetailsbyid`, data);
  }

}
