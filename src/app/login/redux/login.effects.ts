import { LoadingService } from 'src/app/rest-api/loading.service';
import { selectUserProfileData } from 'src/app/redux/user/user.reducer';
import { getLoginProfile } from './login.selector';
import { Router } from '@angular/router';
import { AppState } from './../../reducers/index';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as LoginActions from './login.actions';
import * as UserActions from '../../redux/user/user.actions';
import { Injectable } from '@angular/core';
import { UserAPIService } from 'src/app/rest-api/user-api/user-api.service';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { getReferenceData } from 'src/app/redux/reference-data/reference-data.actions';
import { getUserProfile } from '../../redux/user/user.actions';
import { SentData } from 'src/app/rest-api/sendData';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class LoginEffects {

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.loginAttempt),
      mergeMap((Action) => {
        this._loading.setLoading(true, 'request.url');
        return this.userAPIService.login(Action.payload).pipe(
          map((data: any) => {
            if (this.userAPIService.isValidUser(data)) {
              return LoginActions.loginSuccess({ payload: data });
            }
            this._loading.setLoading(false, 'request.url');
            return LoginActions.loginFailure({ payload: data });
          }),
          catchError((error: any) => {
            this._loading.setLoading(false, 'request.url');
            return of(LoginActions.loginFailure({ payload: error }));
          })
        )
      }
      )
    )
  }
  );


  constructor(private _loading: LoadingService, private actions$: Actions, private userAPIService: UserAPIService, private store: Store<AppState>, private route: Router, private toast: ToastrService,
    private sendData: SentData,
    ) { }

  loginRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LoginActions.loginSuccess),
        tap(async (action: any) => {
          await this.store.dispatch(getReferenceData());
          await this.store.dispatch(getUserProfile());
          await this.store.dispatch(UserActions.getUserProfileSuccess({ payload: action.payload }));
          const permsission = await this.redirectTo();
          if (permsission && permsission == 'ADM' || permsission == 'OADM') {
            sessionStorage.removeItem('routeTo');
            sessionStorage.removeItem('assessmentId');
            return this.route.navigate(['/admin/assessments'])
          }
          if (permsission && permsission == 'AST') {
            if (sessionStorage.getItem('assessmentId') != null) {
              localStorage.setItem('check', 'false');
              return this.route.navigate([
                '/landing/assessment',
                sessionStorage.getItem('assessmentId')
              ]);
            } else {
              if (action.payload.data.assessments.length == 1) {
                const userProfile = JSON.parse(sessionStorage.getItem('user'));
                let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
                var loginReq = {
                  scheduleId: action.payload.data.assessments[0].scheduleId,
                  assessmentCode: action.payload.data.assessments[0].assessmentCode,
                  loginId: sessionStorage.getItem("loginId"),
                  email: email
                }
                // this.userAPIService.checkuserloginWithScheduleId(loginReq).subscribe((loginRes: any) => {
                //   if (loginRes.success) {
                    // if (loginRes && loginRes.message == 'You are logged-in already. Please contact admin team') {
                    //   this._loading.setLoading(false, 'request.url');
                    //   var obj = {
                    //     key: "multiLoginCheck",
                    //     value: {
                    //       modelOpen: true,
                    //       scheduleId: action.payload.data.assessments[0].scheduleId,
                    //       assessmentTestCode: action.payload.data.assessments[0].assessmentCode,
                    //       assessmentId:action.payload.data.assessments[0].id
                    //     }
                    //   }
                    //   this.sendData.sendMessage(obj);
                    // } else {
                      // var attemptObj = {scheduleId: action.payload.data.assessments[0].scheduleId.toString(),email: email};
                      // this.userAPIService.candidateAttemptCountUpdateAPI(attemptObj).subscribe((loginRes: any) => {});
                      localStorage.setItem('scheduleId', action.payload.data.assessments[0].scheduleId);
                      localStorage.setItem('assessmentTestCode', action.payload.data.assessments[0].assessmentCode);

                      if (
                        action.payload.data.assessments[0].formStatus == undefined ||
                        action.payload.data.assessments[0].formStatus == true
                      ) {
                        if (action.payload.data.assessments[0].instructionFlag == 0) {
                          localStorage.setItem('check', 'false');
                          sessionStorage.setItem('assessmentId', action.payload.data.assessments[0].id);
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
                        } else {
                          localStorage.setItem('check', 'false');
                          sessionStorage.setItem('assessmentId', action.payload.data.assessments[0].id);
                          this.route.navigate(['/uapcandidate/generalinstructions'])
                        }

                      } else {
                        if (action.payload.data.assessments[0].instructionFlag == 0) {
                          localStorage.setItem('assessmentIdCode', action.payload.data.assessments[0].id)
                          localStorage.setItem("orgId", action.payload.data.assessments[0].orgId);
                          localStorage.setItem("formtemplate", action.payload.data.assessments[0].formTemplateId)
                          localStorage.setItem("details", JSON.stringify(action.payload.data.assessments[0].formFilledData[0]))
                          this.route.navigate(['/uapcandidate/candidate']);
                        } else {
                          localStorage.setItem('assessmentIdCode', action.payload.data.assessments[0].id)
                          localStorage.setItem("orgId", action.payload.data.assessments[0].orgId);
                          localStorage.setItem("formtemplate", action.payload.data.assessments[0].formTemplateId)
                          localStorage.setItem("details", JSON.stringify(action.payload.data.assessments[0].formFilledData[0]))
                          this.route.navigate(['/uapcandidate/generalinstructions'])
                        }
                      }
                    // }
                  // } else {
                  //   this.toast.success(loginRes.message);
                  // }
                // })
              } else {
                return this.route.navigateByUrl('/landing/assessmentsearch');
              }
            }
          } else {
            this._loading.setLoading(false, 'request.url');
            return this.route.navigate(['/unauthorized']);
          }
        })
      )
    },
    { dispatch: false }
  )

  userRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LoginActions.dummyAction),
        tap(async (action: any) => {
          const permsission = await this.userredirectTo();
          if (permsission && permsission == 'ADM' || permsission == 'OADM') {
            sessionStorage.removeItem('routeTo');
            sessionStorage.removeItem('assessmentId');
            return this.route.navigate(['/admin/assessments'])
          }
          if (permsission && permsission == 'AST') {
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
          } else {
            this._loading.setLoading(false, 'request.url');
            return this.route.navigate(['/unauthorized']);
          }
        })
      )
    },
    { dispatch: false }
  )

  redirectTo(): any {
    let permission;
    this.store.select(getLoginProfile).subscribe((data: any) => {
      permission = data.user.data.attributes?.organisations[0].roles[0].roleCode;
    });
    return permission;
  }

  userredirectTo(): any {
    let permission;
    this.store.select(selectUserProfileData).subscribe((data: any) => {
      permission = data.attributes.organisations[0].roles[0].roleCode;
    });
    return permission;
  }

}
