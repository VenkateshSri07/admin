import { Component, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LandingPageUtils } from '../landing-page.common.utils';
import { AssessmentSummaryModel, StartTimeModel } from './task-cards.model';
import { AssessmentTasksReducerState } from '../redux/landing-page.model';
import { Store } from '@ngrx/store';
import * as assessmentTasksActions from '../redux/landing-page.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentTaskResponse } from 'src/app/rest-api/assessments-api/models/assessment-task-response-model';
import { selectAssessmentTaskUrlState } from '../redux/landing-page.reducers';
import { AssessmentTaskUrlModel } from 'src/app/rest-api/assessments-api/models/assessment-task-url-response-model';
import * as moment from 'moment'; //in your component
import { UapHttpService } from 'src/app/rest-api/uap-http.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { UserAPIService } from 'src/app/rest-api/user-api/user-api.service';
import { LoadingService } from 'src/app/rest-api/loading.service';
import { SentData } from 'src/app/rest-api/sendData';
import { WebSocketService } from 'src/app/rest-api/web-socket/web-socket.service';

@Component({
  selector: 'app-task-cards',
  templateUrl: './task-cards.component.html',
  styleUrls: ['./task-cards.component.scss']
})
export class TaskCardsComponent implements OnInit, OnDestroy {
  totalHours = 0;
  totalMinutes = 0;
  taskDuration: string[] = [];
  taskStatus: string[] = [];
  taskStatusAutoComplete: string[] = [];
  taskUrlData: AssessmentTaskUrlModel;
  isTaskStarted: boolean[] = [];
  taskStartTime: StartTimeModel[] = [];
  showTaskStartsOn: boolean[] = [];
  startTime1: any;
  endTime1: any;
  testStartTime1: any;
  testEndTime1: any;
  testCompletedTime1: any;
  // testAccessStartTime1: any;
  isAssessCode: boolean = false;
  userDetails: any = [];
  progressbarvalue: any;
  assessmentTaskDic = {};
  assessmentTaskArray = [];
  criteriaDic = {};
  currentTaskIndex = -1;
  checkCriteriaMessage: any;
  completedCount = 0;
  checkSuccessMessage: any;
  timeCardValidation = true;
  currentServerTime: any;

  timeInterval;
  timeExpireCheck;

  @Input() canTakeAssessment: boolean;
  @Input() assessmentTasksList: AssessmentTaskResponse[];
  @Output() summaryDetails: EventEmitter<AssessmentSummaryModel> = new EventEmitter();
  @ViewChild('progressbar', { static: false }) progressbar: TemplateRef<any>;
  @ViewChild('popup', { static: false }) popup: TemplateRef<any>;
  @ViewChild('popupsucces', { static: false }) popupsucces: TemplateRef<any>;
  @ViewChild('hrprocccessed', { static: false }) hrprocccessed: TemplateRef<any>;
  constructor(
    public landingUtil: LandingPageUtils,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<AssessmentTasksReducerState>,
    private httpClient: UapHttpService,
    private toast: ToastrService,
    private api: UserAPIService,
    private _loading: LoadingService,
    private sendData: SentData,
    public websocket: WebSocketService,

  ) { }

  ngOnInit(): void {
    // this.socketProgres();
    // this.checkUserLoginActivity();
    // localStorage.removeItem('scheduleId');
   this.api.getCurrentTime().subscribe((res:any)=>{
      var currentTime = new Date(res.data).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
      });
      this.currentServerTime = new Date(currentTime);
       this.isAssessCode =
      sessionStorage.getItem('assessmentId') &&
        sessionStorage.getItem('assessmentId') != '' &&
        sessionStorage.getItem('assessmentId') != undefined
        ? true
        : false;
    if (this.isAssessCode == false) {
      this.router.navigate(['/landing/assessmentsearch']);
      sessionStorage.removeItem('assessmentId');
    }
    this.userDetails = JSON.parse(sessionStorage.getItem('user'));

    if (this.assessmentTasksList[0].assessmentFlow == "sequential") {
      let data = {
        scheduleId: this.assessmentTasksList[0].scheduleId?.toString()
      }
      this.api.getAssessmentTaskCriteria(data).subscribe(async (resData: any) => {
        if (resData.success) {
          await resData.data.forEach((elem) => {
            this.criteriaDic[elem.taskTemplateId] = {
              breakTime: elem.breakTime != undefined && elem.breakTime != null ? elem.breakTime : 0,
              criteriaDet: elem.criteriaDet,
              startDuration: elem.startDuration,
              duration: elem.duration,
              successMsg: elem.successMsg != undefined ? elem.successMsg : "",
              failureMsg: elem.failureMsg != undefined ? elem.failureMsg : ""
            }
          });

          // // only to check all the test are completed
          // let statusCount = 0;
          // for(var elem of this.assessmentTasksList){
          //   if(elem.status == "Completed"){
          //     statusCount = statusCount+1;
          //   }
          // }

          // if(statusCount == this.assessmentTasksList.length){
          //   localStorage.setItem("completedCheck","true");
          // }

          let count = 0;

          for (var task of this.assessmentTasksList) {
            //  var concatedDateTimeoffset = (new Date()).getTimezoneOffset() * 60000;
            // let startTime: any = (new Date(new Date(task.startTime).getTime() + concatedDateTimeoffset));
            // let endTime: any = (new Date(new Date(task.endTime).getTime() + concatedDateTimeoffset));
            let startTime: any = new Date(task.startTime).toLocaleString('en-US', {
              timeZone: 'Asia/Kolkata'
            });
            let endTime: any = new Date(task.endTime).toLocaleString('en-US', {
              timeZone: 'Asia/Kolkata'
            });
            // var newTestStartTime = new Date(task.testStartTime);
            // newTestStartTime.setMinutes(newTestStartTime.getMinutes() + this.criteriaDic[task.taskTemplateId.toString()].startDuration); // timestamp
            let testStartTime: any = new Date(task.testStartTime).toLocaleString('en-US', {
              timeZone: 'Asia/Kolkata'
            });
            let testEndTime: any = new Date(task.testEndTime).toLocaleString('en-US', {
              timeZone: 'Asia/Kolkata'
            });
            // let testAccessStartTime: any = new Date(task.testStartTime).toLocaleString('en-US', {
            //   timeZone: 'Asia/Kolkata'
            // });
            if (task.completedTime != undefined) {
              let testCompletedTime: any = new Date(task.completedTime).toLocaleString('en-US', {
                timeZone: 'Asia/Kolkata'
              });
              this.testCompletedTime1 = new Date(testCompletedTime);
              this.testCompletedTime1.setSeconds(0);
            } else {
              this.testCompletedTime1 = "-"
            }

            this.startTime1 = new Date(startTime);
            this.startTime1.setSeconds(0);

            this.endTime1 = new Date(endTime);
            this.endTime1.setSeconds(0);

            this.testStartTime1 = new Date(testStartTime);
            this.testStartTime1.setSeconds(0);

            // this.testAccessStartTime1 = new Date(testAccessStartTime);
            this.testEndTime1 = new Date(testEndTime);
            this.testEndTime1.setSeconds(0);

            this.assessmentTaskDic[task.id] = { startTime: this.startTime1, endTime: this.endTime1, testStartTime: this.testStartTime1, testEndTime: this.testEndTime1, testCompletedTime: this.testCompletedTime1 }
            this.taskDuration.push(this.getTaskDuration(task.duration));
            this.taskStatus.push(task.status.toLowerCase());
            this.taskStatusAutoComplete.push(task.remarks);
            if (this.taskStatus && this.taskStatus[0] == 'completed') {
              if (localStorage.getItem("qusremaintime"))
                localStorage.removeItem("qusremaintime");
              localStorage.removeItem("activequs");
              localStorage.removeItem("SCfinish");
              localStorage.removeItem("resumeTest");

            }
            // const currentTime = new Date();
            // let currentTime: any = new Date(task.currentDateTime).toLocaleString('en-US', {
            //   timeZone: 'Asia/Kolkata'
            // });
            // currentTime = new Date(currentTime);
            // currentTime.setSeconds(0);

            this.isTaskStarted.push(this.startTime1 > new Date(this.currentServerTime));
            this.getCountdownTimer(this.startTime1, new Date(this.currentServerTime));
            // this.isTaskStarted.push(this.endTime1 > currentTime);
            // this.getCountdownTimerOne(this.endTime1, currentTime);
            if (task.assessmentFlow == "sequential") {
              if (count == 0) {
                // commented the below code. So that if the test card is expired, the next test will not be shown
                // var now = moment(this.startTime1);
                // var future:any = now.add(this.criteriaDic[task.taskTemplateId.toString()].startDuration, 'minutes');
                // var checkDate = new Date(future);
                // var currentDate = new Date();
                // var custom = moment(checkDate).diff(moment(currentDate), 'minutes');
                // if (task.status == "YetToStart" && (custom >= 0)) {
                if (task.status == "YetToStart") {
                  count = count + 1;

                  // added campus sync when the test is expired
                  var now = moment(this.startTime1);
                  var future: any = now.add(this.criteriaDic[task?.taskTemplateId?.toString()]?.startDuration, 'minutes');
                  var checkDate = new Date(future);
                  // var currentDate = new Date();
                  let custom = moment(checkDate).diff(moment(this.currentServerTime), 'seconds');
                  custom = custom + 60;
                  if (custom < 0) {
                    this.assessmentScoreSync(task, [], "expired")
                    setTimeout(() => {
                      this.assessmentScoreSyncWithCampus(task)
                    }, 5000);
                    this.getCandidateDetails(task)
                  } else {
                    localStorage.removeItem("details");
                    localStorage.removeItem("orgId");
                    localStorage.removeItem("formtemplate");
                    localStorage.removeItem("candidateProfileForm");
                    var obj = {
                      key: "candidateProfileFormButton",
                      value: true
                    }
                    this.sendData.sendMessage(obj);
                  }
                } else if (task.status == "InProgress") {
                  count = count + 1;
                }
                var checkCriteria: any = await this.checkCriteriaFortask(task)
                // console.log("checkCriteria-->",checkCriteria.message)

                if (!checkCriteria.success) {
                  count = count + 1;
                }
                this.assessmentTaskArray.push(task)
                this.currentTaskIndex = this.currentTaskIndex + 1;
                // console.log(this.currentTaskIndex)
              }
            } else {
              this.assessmentTaskArray.push(task)
            }
          };

          // console.log("assessmentTaskArray--->", this.assessmentTaskArray, this.criteriaDic)
          const assessmentTotalMinutes = this.landingUtil.getHourAndMinutes(
            this.totalHours * 60 + this.totalMinutes
          );
          this.summaryDetails.emit({
            hour: this.landingUtil.getDurationMessage(assessmentTotalMinutes),
            tasks: this.assessmentTasksList.length
          });
        } else {
          this.toast.error(resData.message);
        }
      })
    } else {
      for (var task of this.assessmentTasksList) {
        //  var concatedDateTimeoffset = (new Date()).getTimezoneOffset() * 60000;
        // let startTime: any = (new Date(new Date(task.startTime).getTime() + concatedDateTimeoffset));
        // let endTime: any = (new Date(new Date(task.endTime).getTime() + concatedDateTimeoffset));
        let startTime: any = new Date(task.startTime).toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata'
        });
        let endTime: any = new Date(task.endTime).toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata'
        });
        let testStartTime: any = new Date(task.testStartTime).toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata'
        });
        let testEndTime: any = new Date(task.testEndTime).toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata'
        });

        // let testAccessStartTime: any = new Date(task.testStartTime).toLocaleString('en-US', {
        //   timeZone: 'Asia/Kolkata'
        // });

        if (task.completedTime != undefined) {
          let testCompletedTime: any = new Date(task.completedTime).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata'
          });
          this.testCompletedTime1 = new Date(testCompletedTime);
          this.testCompletedTime1.setSeconds(0);

        } else {
          this.testCompletedTime1 = "-"
        }

        // this.testAccessStartTime1 = new Date(testAccessStartTime);
        this.startTime1 = new Date(startTime);
        this.startTime1.setSeconds(0);

        this.endTime1 = new Date(endTime);
        this.endTime1.setSeconds(0);

        this.testStartTime1 = new Date(testStartTime);
        this.testStartTime1.setSeconds(0);

        this.testEndTime1 = new Date(testEndTime);
        this.testEndTime1.setSeconds(0);

        this.assessmentTaskDic[task.id] = { startTime: this.startTime1, endTime: this.endTime1, testStartTime: this.testStartTime1, testEndTime: this.testEndTime1, testCompletedTime: this.testCompletedTime1 }
        this.taskDuration.push(this.getTaskDuration(task.duration));
        this.taskStatus.push(task.status.toLowerCase());
        this.taskStatusAutoComplete.push(task.remarks);
        if (this.taskStatus && this.taskStatus[0] == 'completed') {
          if (localStorage.getItem("qusremaintime"))
            localStorage.removeItem("qusremaintime");
          localStorage.removeItem("activequs");
          localStorage.removeItem("SCfinish");
          localStorage.removeItem("resumeTest");

        }
        // const currentTime = new Date();
        // let currentTime: any = new Date(task.currentDateTime).toLocaleString('en-US', {
        //   timeZone: 'Asia/Kolkata'
        // });
        // currentTime = new Date(currentTime);
        this.isTaskStarted.push(this.startTime1 > new Date(this.currentServerTime));
        this.getCountdownTimer(this.startTime1, new Date(this.currentServerTime));
        // this.isTaskStarted.push(this.endTime1 > currentTime);
        // this.getCountdownTimerOne(this.endTime1, currentTime);
        this.assessmentTaskArray.push(task)
      };
      const assessmentTotalMinutes = this.landingUtil.getHourAndMinutes(
        this.totalHours * 60 + this.totalMinutes
      );
      this.summaryDetails.emit({
        hour: this.landingUtil.getDurationMessage(assessmentTotalMinutes),
        tasks: this.assessmentTasksList.length
      });
    }
   });
  }

  async checkCriteriaFortask(task) {
    if (this.criteriaDic[task?.taskTemplateId?.toString()]?.criteriaDet.length) {
      if (task.status == "Completed") {
        this.completedCount = this.completedCount + 1;
        //assessmentScoreSync is only to store section wise data to db. not used in test card.
        var criteriaArray = this.criteriaDic[task?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[task?.taskTemplateId?.toString()]?.criteriaDet : []
        this.assessmentScoreSync(task, criteriaArray, "")
        if (this.completedCount == this.assessmentTasksList.length) {
          // this.getCandidateDetails(task)
          var nextTaskTemplateId = this.assessmentTasksList[this.completedCount] != undefined ? this.assessmentTasksList[this.completedCount]?.taskTemplateId : '';

          var nextTestEndTime = this.assessmentTasksList[this.currentTaskIndex + 2]?.testEndTime;
          let testEndtime;
          if (nextTestEndTime != undefined) {
            let endtime: any = new Date(nextTestEndTime).toLocaleString('en-US', {
              timeZone: 'Asia/Kolkata'
            });
            testEndtime = new Date(endtime)
          }

          var obj = {
            taskTemplateId: nextTaskTemplateId,
            // breakTime: this.criteriaDic[nextTaskTemplateId] != undefined ? this.criteriaDic[nextTaskTemplateId].breakTime : 1,
            breakTime: this.criteriaDic[task?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[task?.taskTemplateId?.toString()].breakTime : 0,
            duration: this.criteriaDic[nextTaskTemplateId?.toString()] != undefined ? this.criteriaDic[nextTaskTemplateId?.toString()].duration : undefined,
            criteriaDet: this.criteriaDic[task?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[task?.taskTemplateId?.toString()].criteriaDet : [],
            startDuration: this.criteriaDic[nextTaskTemplateId?.toString()] != undefined ? this.criteriaDic[nextTaskTemplateId?.toString()].startDuration : 1,
            testEndtime: testEndtime != undefined && testEndtime != null ? testEndtime : undefined
          }
          let syncRes: any = await this.getResultSync(task, obj, true, "lastIndex")
          if (syncRes) {
            var completedCheck = localStorage.getItem("completedCheck");
            if (completedCheck != "true") {
              this.getDefaultMessage(task);
              this.dialog.open(this.hrprocccessed, {
                width: '570px',
                height: '340px',
                disableClose: true
              })
              localStorage.setItem("completedCheck", "true");
            }
          }
          this.getCandidateDetails(task)
          // campus sync for all test completed with criteria
          setTimeout(() => {
            this.assessmentScoreSyncWithCampus(task)
          }, 5000);
          return { success: true, message: "all test completed" };
        } else {
          var scoreObj: any = await this.getAssessmentResult(task)
          // console.log("scoreObj", scoreObj)
          if (scoreObj != undefined) {
            let criteriaCount = 0;
            var criteriaArray = this.criteriaDic[task?.taskTemplateId?.toString()]?.criteriaDet;
            for (var elem of criteriaArray) {
              let score = 0;
              if (elem.criteria == "Overall Test Score") {
                score = scoreObj.percentage != undefined ? scoreObj.percentage : 0;
              } else if (elem.criteria == "Proctor Score") {
                score = scoreObj.credibilityScore != undefined ? scoreObj.credibilityScore : 0;
              }

              if (elem.condtiton == "Greater than or Equal to") {
                if (score >= parseInt(elem.percentage)) {
                  criteriaCount = criteriaCount + 1;
                }
              } else if (elem.condtiton == "Less than or Equal to") {
                if (score <= parseInt(elem.percentage)) {
                  criteriaCount = criteriaCount + 1;
                }
              } else if (elem.condtiton == "Equals to") {
                if (score == parseInt(elem.percentage)) {
                  criteriaCount = criteriaCount + 1;
                }
              } else {
                //  console.log("No condition match for ",elem.criteria)
              }
            }
            if (criteriaCount == criteriaArray.length) {
              return { success: true, message: "success" };
            } else {
              var criteriaArray = this.criteriaDic[task?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[task?.taskTemplateId?.toString()].criteriaDet : []
              this.assessmentScoreSync(task, criteriaArray, "")
              this.getCandidateDetails(task)
              //campus sync if criteria failed when refresh the page
              setTimeout(() => {
                this.assessmentScoreSyncWithCampus(task)
              }, 5000);
              return { success: false, message: "You are not qualify" };
            }
          } else {
            this.timeCardValidation = false;
            this.progressbarPopUp();
            var result: any = await this.progressBarTimeSet(task);
            if (result) {
              return { success: true, message: "Can continue" };
            } else {
              return { success: false, message: " issue in api" };
            }
          }
        }
      } else {
        return { success: false, message: "status is not completed so return false" };
      }
    } else {
      if (task.status == "Completed") {
        //assessmentScoreSync is only to store section wise data to db. not used in test card.
        var criteriaArray = this.criteriaDic[task?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[task?.taskTemplateId?.toString()].criteriaDet : []
        this.assessmentScoreSync(task, criteriaArray, "");
        this.completedCount = this.completedCount + 1;
        if (this.completedCount == this.assessmentTasksList.length) {
          // this.getCandidateDetails(task)
          var nextTaskTemplateId = this.assessmentTasksList[this.completedCount] != undefined ? this.assessmentTasksList[this.completedCount]?.taskTemplateId : '';
          var nextTestEndTime = this.assessmentTasksList[this.currentTaskIndex + 2]?.testEndTime;
          let testEndtime;
          if (nextTestEndTime != undefined) {
            let endtime: any = new Date(nextTestEndTime).toLocaleString('en-US', {
              timeZone: 'Asia/Kolkata'
            });
            testEndtime = new Date(endtime)
          }
          var obj = {
            taskTemplateId: nextTaskTemplateId,
            // breakTime: this.criteriaDic[nextTaskTemplateId] != undefined ? this.criteriaDic[nextTaskTemplateId].breakTime : 1,
            breakTime: this.criteriaDic[task?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[task?.taskTemplateId?.toString()]?.breakTime : 0,
            duration: this.criteriaDic[nextTaskTemplateId?.toString()] != undefined ? this.criteriaDic[nextTaskTemplateId?.toString()]?.duration : undefined,
            criteriaDet: this.criteriaDic[task?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[task?.taskTemplateId?.toString()]?.criteriaDet : [],
            startDuration: this.criteriaDic[nextTaskTemplateId?.toString()] != undefined ? this.criteriaDic[nextTaskTemplateId?.toString()]?.startDuration : 1,
            testEndtime: testEndtime != undefined && testEndtime != null ? testEndtime : undefined
          }
          let syncRes: any = await this.getResultSync(task, obj, false, "lastIndex")
          if (syncRes) {
            var completedCheck = localStorage.getItem("completedCheck");
            if (completedCheck != "true") {
              this.getDefaultMessage(task);
              this.dialog.open(this.hrprocccessed, {
                width: '570px',
                height: '340px',
                disableClose: true
              })
              localStorage.setItem("completedCheck", "true");
            }
          }
          this.getCandidateDetails(task)
          //campus sync when all test completed without criteria
          setTimeout(() => {
            this.assessmentScoreSyncWithCampus(task)
          }, 5000);
          return { success: true, message: "all test completed" };
        } else {
          var nextTaskTemplateId = this.assessmentTasksList[this.completedCount] != undefined ? this.assessmentTasksList[this.completedCount]?.taskTemplateId : undefined;
          var nextTestEndTime = this.assessmentTasksList[this.currentTaskIndex + 2]?.testEndTime;
          let testEndtime;
          if (nextTestEndTime != undefined) {
            let endtime: any = new Date(nextTestEndTime).toLocaleString('en-US', {
              timeZone: 'Asia/Kolkata'
            });
            testEndtime = new Date(endtime)
          }
          var obj = {
            taskTemplateId: nextTaskTemplateId,
            // breakTime: this.criteriaDic[nextTaskTemplateId] != undefined ? this.criteriaDic[nextTaskTemplateId].breakTime : 1,
            breakTime: this.criteriaDic[task.taskTemplateId?.toString()] != undefined ? this.criteriaDic[task.taskTemplateId?.toString()]?.breakTime : 0,
            duration: this.criteriaDic[nextTaskTemplateId?.toString()] != undefined ? this.criteriaDic[nextTaskTemplateId?.toString()]?.duration : undefined,
            criteriaDet: this.criteriaDic[task.taskTemplateId?.toString()] != undefined ? this.criteriaDic[task.taskTemplateId?.toString()]?.criteriaDet : [],
            startDuration: this.criteriaDic[nextTaskTemplateId?.toString()] != undefined ? this.criteriaDic[nextTaskTemplateId?.toString()]?.startDuration : 1,
            testEndtime: testEndtime != undefined && testEndtime != null ? testEndtime : undefined
          }
          this.getResultSync(task, obj, false, "")
        }
      }
      return { success: true, message: "no criteria found" };
    }

  }

  async getAssessmentResult(task: any) {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
    let data = {
      scheduleId: task.scheduleId?.toString(),
      email: email,
      taskTemplateId: task?.taskTemplateId?.toString()
    }
    let response: any = await this.api.getAssessmentResultApi(data).toPromise();
    if (response.success) {
      return response.data;
    } else {
      return undefined
    }

  }

  async getResultSync(task: any, NextTaskTemplateArray, criteriaFound, ArrayPosition) {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
    let assessmentId = sessionStorage.getItem('assessmentId');
    // console.log("assessmentId",assessmentId)
    let data = {
      scheduleId: task.scheduleId?.toString(),
      email: email,
      orgId: task.orgId?.toString(),
      taskTemplateId: task?.taskTemplateId?.toString(),
      assessmentId: assessmentId,
      deliveryId: task.deliveryId,
      taskType: task.taskType,
      NextTaskTemplateArray: NextTaskTemplateArray,
      criteriaFound: criteriaFound,
      instanceId: task.instanceId,
      srcSystem: task.srcSystem,
      srcTaskIdentifier: task.srcTaskIdentifier,
      ArrayPosition: ArrayPosition,
      taskId: task.id
    }
    let response: any = await this.api.getResultSyncApi(data).toPromise();
    if (response.success) {
      //if criteriaFound equal to false. need to refresh the page so that next test time will be updated and effected in the card
      if (criteriaFound == false && ArrayPosition != 'lastIndex') {
        window.location.reload();
      }
      return true;
    } else {
      return false;
    }
  }

  //assessmentScoreSync is only to store section wise data to db. not used in test card.
  assessmentScoreSync(task: any, criteriaArray, testSynctype) {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
    let assessmentId = sessionStorage.getItem('assessmentId');
    // console.log("assessmentId",assessmentId)
    let data = {
      scheduleId: task.scheduleId?.toString(),
      email: email,
      orgId: task.orgId?.toString(),
      taskTemplateId: task?.taskTemplateId?.toString(),
      assessmentId: assessmentId,
      deliveryId: task.deliveryId,
      taskType: task.taskType,
      criteriaArray: criteriaArray,
      instanceId: task.instanceId,
      srcSystem: task.srcSystem,
      srcTaskIdentifier: task.srcTaskIdentifier,
      campusDriveId: task.campusDriveId,
      testStartTime: task.testStartTime,
      taskName: task.taskName,
      scheduleName: task.scheduleName,
      taskId: task.id,
      testSynctype: testSynctype
    }
    let response: any = this.api.getAssessmentScoreApi(data).toPromise();
    if (response.success) {
      // console.log("success")
    } else {
      // console.log("false")
    }
  }

  getTaskDuration(taskDuration: number): string {
    const hourAndMinute = this.landingUtil.getHourAndMinutes(taskDuration);
    this.totalMinutes += hourAndMinute.minute;
    this.totalHours += hourAndMinute.hour;
    return this.landingUtil.getDurationMessage(hourAndMinute);
  }

  navigateToTask(taskId: number, taskType: any, taskstatus: any, task: any): void {
    this.api.getCurrentTime().subscribe((res: any) => {
      var currentTime = new Date(res.data).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
      });
      var currentDate = new Date(currentTime);
      let startTime: any = new Date(task.startTime).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
      });
      var startTime1 = new Date(startTime);
      startTime1.setSeconds(0);
      if (new Date(currentDate).getTime() >= startTime1.getTime()) {

        if (taskType == 'Video Assessment') {
          if (this.taskStatus[0] == 'completed') {
            localStorage.removeItem('qusremaintime');
            localStorage.removeItem('activequs');
            localStorage.removeItem('SCfinish');
            localStorage.removeItem('resumeTest');
          }
          this.store.dispatch(
            assessmentTasksActions.getAssessmentTaskUrl({
              payload: {
                assessmentId: this.route.snapshot.paramMap.get('id') || '',
                taskId,
                loginId: sessionStorage.getItem('loginId')
              }
            })
          );
          this.store
            .select(selectAssessmentTaskUrlState)
            .subscribe((response: AssessmentTaskUrlModel): void => {
              this.taskUrlData = response;
              if (this.taskUrlData.proctorToken.length > 0) {
                sessionStorage.setItem(
                  'lastQus',
                  JSON.stringify(this.taskUrlData.attributes.lastVideoQuestionDetails)
                );
                sessionStorage.setItem('videotoken', this.taskUrlData.proctorToken);
                sessionStorage.setItem('schuduleId', this.taskUrlData.attributes.scheduleId);
                if (taskstatus != 'inprogress') {
                  this.router.navigate(['/landing/SystemReadinessCheck']);
                  localStorage.setItem('SCfinish', 'false');
                } else {
                  this.router.navigate(['/landing/VideoAssesment']);
                  localStorage.setItem('SCfinish', 'ture');
                }
              } else {
              }
            });
        } else {
          this.store.dispatch(
            assessmentTasksActions.getAssessmentTaskUrl({
              payload: {
                assessmentId: this.route.snapshot.paramMap.get('id') || '',
                taskId,
                loginId: sessionStorage.getItem('loginId')
              }
            })
          );
          this.store
            .select(selectAssessmentTaskUrlState)
            .subscribe((response: AssessmentTaskUrlModel): void => {
              if (response.success != undefined && response.success == false) {
                this.toast.warning(response.message);
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              } else {
                this.taskUrlData = response;
                if (this.taskUrlData.attributes.taskUrl) {
                  window.location.assign(this.taskUrlData.attributes.taskUrl);
                }
              }
            });
        }
      } else {
        this.toast.warning("Please ensure that the system time aligns with your timezone.");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });
  }

  getCountdownTimer(startTime: Date, currentTime: Date): void {
    const leftOutTime = startTime.getTime() - currentTime.getTime();
    this.showTaskStartsOn.push(leftOutTime > 0);
    const leftTime = leftOutTime / 1000;
    const startOn = `${startTime.getDate()}/${startTime.getMonth() + 1}/${startTime.getFullYear()}`;
    // console.log(startOn, 'starttt');

    const showCountdown = leftTime < 86400 ? true : false;

    this.taskStartTime.push({
      countdown: { leftTime, format: 'HH: mm: ss' },
      startOn,
      showCountdown
    });
  }
  getCountdownTimerOne(endTime: Date, currentTime: Date): void {
    const leftOutTime = endTime.getTime() - currentTime.getTime();
    this.showTaskStartsOn.push(leftOutTime > 0);
    const leftTime = leftOutTime / 1000;
    const startOn = `${endTime.getDate()}/${endTime.getMonth() + 1}/${endTime.getFullYear()}`;
    // console.log(startOn, 'end');

    const showCountdown = leftTime < 86400 ? true : false;

    this.taskStartTime.push({
      countdown: { leftTime, format: 'HH: mm: ss' },
      startOn,
      showCountdown
    });
  }


  countdownchange(event: any, index: number): void {
    if (event.action === 'done' && event.left === 0 ) {
      this.showTaskStartsOn[index] = false;
      this.isTaskStarted[index] = false;
    } else if (event.action === 'done'  && event.left < 0) {
      window.location.reload();
    }
  }

  getTooltipMessage(data) {
    // var currentDate = new Date();
    let custom = moment(data.endTime).diff(moment(this.currentServerTime), 'minutes');
    // console.log(custom);

    if (custom >= 0) {
      return '';
    }
    return 'Test time has been completed';
  }

  getIsTimeOutStatus(data, status) {
    if (data.assessmentFlow == "sequential") {
      // var currentDat: any = new Date().toLocaleString('en-US', {
      //   timeZone: 'Asia/Kolkata'
      // });
      // var current = new Date(currentDat);
      if (status == 'yettostart') {
        let custom = moment(this.assessmentTaskDic[data.id].testEndTime).diff(moment(this.currentServerTime), 'seconds');
        custom = custom + 60;
        if (custom >= 0) {
          if (custom == 0) {
            if (this.timeExpireCheck == undefined) {
              this.timeExpireCheck = setTimeout(() => {
                window.location.reload();
              }, (1) * 1000);
            }
          } else {
            if (this.timeExpireCheck == undefined) {
              this.timeExpireCheck = setTimeout(() => {
                window.location.reload();
              }, (custom + 1) * 1000);
            }
          }
          return false;
        }
        return true;
      }
      else if (status == 'inprogress') {
        let custom = moment(this.assessmentTaskDic[data.id].endTime).diff(moment(this.currentServerTime), 'seconds');
        custom = custom + 60;
        if (custom >= 0) {
          if (custom == 0) {
            if (this.timeExpireCheck == undefined) {
              this.timeExpireCheck = setTimeout(() => {
                window.location.reload();
              }, (1) * 1000);
            }
          } else {
            if (this.timeExpireCheck == undefined) {
              this.timeExpireCheck = setTimeout(() => {
                window.location.reload();
              }, (custom + 1) * 1000);
            }
          }
          return false;
        }
        return true;
      }
    } else {
      if (data.remarks == 'activityTimeHold') {
        return true;
      } else {
        if (status == 'inprogress' || status == 'yettostart') {
          // var currentDate = new Date();
          let custom = moment(data.endTime).diff(moment(this.currentServerTime), 'minutes');
          if (custom >= 0) {
            return false;
          }
          return true;
        }
      }
    }
  }

  isEclipsisNeeded(name) {
    if (name.length > 43) {
      let eclipe = '...';
      return name.substr(0, 43) + eclipe;
    } else {
      return name;
    }
  }

  progressbarPopUp() {
    this.dialog.open(this.progressbar, {
      width: '520px',
      height: 'auto',
      panelClass: 'my-custom-dialog-class',
      disableClose: true
    });
  }
  getTime(date) {
    if (date) {
      const split = moment(date).format('LLL');
      return split;
    }
  }

  async progressBarTimeSet(task) {
    this.progressbarvalue = 10;
    var percentage1res: any = await this.percentWith25(task);
    var percentage2res = await this.percentWith50();
    var percentage3res: any = await this.percentWith75(task);
    let percentage3ResEmptyCheck = false;
    // console.log("--percentage3res->",percentage3res)
    if (percentage3res != undefined && percentage3res != false) {
      // console.log("--percentage3res->",percentage3res)
      let criteriaCount = 0;
      var criteriaArray = this.criteriaDic[task?.taskTemplateId?.toString()].criteriaDet;
      // console.log("criteriaArray-->",criteriaArray)
      for (var elem of criteriaArray) {
        let score = 0;
        if (elem.criteria == "Overall Test Score") {
          score = percentage3res.percentage != undefined ? percentage3res.percentage : 0;
        } else if (elem.criteria == "Proctor Score") {
          score = percentage3res.credibilityScore != undefined ? percentage3res.credibilityScore : 0;
        }
        // console.log("--->score",score)
        if (elem.condtiton == "Greater than or Equal to") {
          if (score >= parseInt(elem.percentage)) {
            criteriaCount = criteriaCount + 1;
          }
        } else if (elem.condtiton == "Less than or Equal to") {
          if (score <= parseInt(elem.percentage)) {
            criteriaCount = criteriaCount + 1;
          }
        } else if (elem.condtiton == "Equals to") {
          if (score == parseInt(elem.percentage)) {
            criteriaCount = criteriaCount + 1;
          }
        } else {
          percentage3res = false
        }
      }
      // console.log("criteriaArray.length", criteriaCount, criteriaArray.length)
      if (criteriaCount == criteriaArray.length) {
        percentage3res = true
      } else {
        this.getCandidateDetails(task)
        //campus sync if criteria failed while result sync
        this.assessmentScoreSyncWithCampus(task);
        percentage3res = false
      }
    } else {
      percentage3res = false;
      percentage3ResEmptyCheck = true;
    }

    var percentage4res = await this.percentWith100();
    // console.log("percentage res ----> ", percentage1res, percentage2res, percentage3res, percentage4res)
    if (percentage1res && percentage2res && percentage3res && percentage4res) {
      let breakTime = this.criteriaDic[task?.taskTemplateId?.toString()].breakTime;
      if (breakTime == undefined || breakTime == 0 || breakTime == null) {
        var nextTaskStartTime = this.assessmentTasksList[this.currentTaskIndex + 2]?.testStartTime;
        let startTime: any = new Date(nextTaskStartTime).toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata'
        });
        var testStartTime = new Date(startTime)
        breakTime = moment(testStartTime).diff(moment(this.currentServerTime), 'minutes');
      }
      var timeConvert = moment.duration(breakTime, 'minutes');
      var timeDay = timeConvert.days();
      var timeHr = timeConvert.hours();
      var timeMin = timeConvert.minutes();
      this.checkCriteriaMessage = `${this.criteriaDic[task?.taskTemplateId?.toString()].successMsg}. Your next test will start in ${timeDay > 0 ? timeDay + " Day(s) " : ''} ${timeHr > 0 ? timeHr + " hour(s) " : ''} ${timeMin > 0 ? timeMin + " minute(s)" : ''} `
      this.dialog.closeAll()
      this.dialog.open(this.popupsucces, {
        width: '519px',
        height: '324px',
        disableClose: true
      })
      return true;
    } else {
      //error msg
      this.checkCriteriaMessage = `${this.criteriaDic[task?.taskTemplateId?.toString()].failureMsg}`
      if (percentage3ResEmptyCheck) {
        this.checkCriteriaMessage = "Something went wrong! Please contact administrator."
      }

      this.dialog.closeAll()
      this.dialog.open(this.popup, {
        width: '519px',
        height: '324px',
        disableClose: true
      })
      return false;
    }
  }

  async percentWith25(task) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        this.progressbarvalue = 25;
        // sync code for result sync
        var nextTaskTemplateId = this.assessmentTasksList[this.completedCount] != undefined ? this.assessmentTasksList[this.completedCount]?.taskTemplateId : '';
        var nextTestEndTime = this.assessmentTasksList[this.currentTaskIndex + 2]?.testEndTime;
        let testEndtime;
        if (nextTestEndTime != undefined) {
          let endtime: any = new Date(nextTestEndTime).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata'
          });
          testEndtime = new Date(endtime)
        }
        var obj = {
          taskTemplateId: nextTaskTemplateId,
          // breakTime: this.criteriaDic[nextTaskTemplateId] != undefined ? this.criteriaDic[nextTaskTemplateId].breakTime : 1,
          breakTime: this.criteriaDic[task?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[task?.taskTemplateId?.toString()]?.breakTime : 0,
          duration: this.criteriaDic[nextTaskTemplateId?.toString()] != undefined ? this.criteriaDic[nextTaskTemplateId?.toString()]?.duration : undefined,
          criteriaDet: this.criteriaDic[task?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[task?.taskTemplateId?.toString()]?.criteriaDet : [],
          startDuration: this.criteriaDic[nextTaskTemplateId?.toString()] != undefined ? this.criteriaDic[nextTaskTemplateId?.toString()]?.startDuration : 1,
          testEndtime: testEndtime != undefined && testEndtime != null ? testEndtime : undefined
        }
        var resultSyncObj: any = await this.getResultSync(task, obj, true, "")
        resolve(resultSyncObj);
        //resolve(true);
      }, 10000);
    });
  }

  async percentWith50() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.progressbarvalue = 50;
        resolve(true);
      }, 15000);
    });
  }

  async percentWith75(task) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        this.progressbarvalue = 75;
        var scoreObj: any = await this.getAssessmentResult(task)
        // console.log("scoreObj--->",scoreObj)
        if (scoreObj == undefined) {
          resolve(false);
        } else {
          resolve(scoreObj);
        }
      }, 20000);
    });
  }

  async percentWith100() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.progressbarvalue = 100;
        resolve(true);
      }, 25000);
    });
  }
  closePopup() {
    this.dialog.closeAll()
    this.timeCardValidation = true;
  }
  closePopupSuccess() {
    var nextTask: any = this.assessmentTasksList[this.completedCount] != undefined ? this.assessmentTasksList[this.completedCount] : '';
    var previousTask: any = this.assessmentTasksList[this.completedCount - 1] != undefined ? this.assessmentTasksList[this.completedCount - 1] : '';
    var nextTestEndTime = this.assessmentTasksList[this.completedCount]?.testEndTime;

    let testEndtime;
    if (nextTestEndTime != undefined) {
      let endtime: any = new Date(nextTestEndTime).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
      });
      testEndtime = new Date(endtime)
    }
    var obj = {
      taskTemplateId: nextTask.taskTemplateId,
      duration: this.criteriaDic[nextTask?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[nextTask?.taskTemplateId?.toString()]?.duration : undefined,
      startDuration: this.criteriaDic[nextTask?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[nextTask?.taskTemplateId?.toString()]?.startDuration : 1,
      breakTime: this.criteriaDic[previousTask?.taskTemplateId?.toString()] != undefined ? this.criteriaDic[previousTask?.taskTemplateId?.toString()]?.breakTime : 0,
      testEndtime: testEndtime != undefined && testEndtime != null ? testEndtime : undefined
    }
    this._loading.setLoading(true, 'request.url');

    this.checkTimeInterval(nextTask, obj)
    // this.timeCardValidation = true;
  }

  async assessmentScoreSyncWithCampus(task) {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
    let data = {
      scheduleId: task.scheduleId?.toString(),
      email: email,
      driveId: task.campusDriveId?.toString(),
      "bulkSync": false,
      "assessmentTestSize": this.assessmentTasksList.length,
      'resultNotifyFailure': parseInt(task.resultNotifyFailure),
      'resultNotifySuccess': parseInt(task.resultNotifySuccess),
      'resultNotifyFailureTemplate': task.resultNotifyFailureTemplate,
      'resultNotifySuccessTemplate': task.resultNotifySuccessTemplate
    }
    let response: any = await this.api.assessmentScoreCampusSync(data).toPromise();
    if (response.success) {
      //  console.log(response.message)
    } else {
      // console.log(response.message)
    }
  }

  checkTimeInterval(task, object) {
    this.timeInterval = setInterval(() => {
      this.startTimeInterval(task, object)
    }, 1000)
  }

  ngOnDestroy() {
    this.stopTimeInterval();
    clearInterval(this.timeExpireCheck);
  }

  updateCurrentAssessment1(task, NextTaskTemplateArray) {
    let assessmentId = sessionStorage.getItem('assessmentId');
    let data = {
      taskTemplateId: task?.taskTemplateId?.toString(),
      assessmentId: assessmentId,
      NextTaskTemplateArray: NextTaskTemplateArray,
    }
    this.api.updateCurrentAssessmentSync(data).subscribe((data: any) => {
      if (data.success) {
        this._loading.setLoading(false, 'request.url');
        this.dialog.closeAll()
        window.location.reload();
      } else {
        this._loading.setLoading(false, 'request.url');
        this.toast.error("Something went wrong. Please try Again");
      }
    });
  }


  startTimeInterval(nextTask, obj) {
    // const date = new Date();
    if (this.currentServerTime.getSeconds() == 0) {
      this.updateCurrentAssessment1(nextTask, obj)
      this.stopTimeInterval()
    }
  }

  stopTimeInterval() {
    clearInterval(this.timeInterval);
  }

  getDefaultMessage(task) {
    this.api.getAssessmentTaskCriteria({ scheduleId: "000" }).subscribe((resData: any) => {
      if (resData.success) {
        this.checkSuccessMessage = this.criteriaDic[task?.taskTemplateId?.toString()] != undefined &&
          this.criteriaDic[task?.taskTemplateId?.toString()].successMsg != null &&
          this.criteriaDic[task?.taskTemplateId?.toString()].successMsg != '' ?
          this.criteriaDic[task?.taskTemplateId?.toString()]?.successMsg :
          resData.data[0].successMsg != undefined ? resData.data[0].successMsg : ''
      } else {
        this.checkSuccessMessage = this.criteriaDic[task?.taskTemplateId?.toString()] != undefined &&
          this.criteriaDic[task?.taskTemplateId?.toString()].successMsg != null &&
          this.criteriaDic[task?.taskTemplateId?.toString()].successMsg != '' ?
          this.criteriaDic[task?.taskTemplateId?.toString()]?.successMsg : ''
      }
    });
  }

  getCandidateDetails(task) {
    const userProfile = JSON.parse(sessionStorage.getItem('user'));
    let email = userProfile && userProfile.attributes && userProfile.attributes.email ? userProfile.attributes.email : null;
    var obj = {
      scheduleId: task.scheduleId?.toString(),
      emailId: email
    }
    this.api.getCandidateDetailsAPI(obj).subscribe((resData: any) => {
      if (resData.success) {
        if (resData.data.candidateInfo.validateDocument == false) {
          if (resData.data.updatedCandidateInfo != undefined) {
            localStorage.setItem("details", JSON.stringify(resData.data.updatedCandidateInfo))
          } else {
            localStorage.setItem("details", JSON.stringify(resData.data.candidateInfo))
          }
          localStorage.setItem("orgId", resData.data.candidateInfo.orgId);
          localStorage.setItem("formtemplate", resData.data.candidateInfo.formTemplateId)
          localStorage.setItem("candidateProfileForm", "candidateMyProfile");
          var obj = {
            key: "candidateProfileFormButton",
            value: false
          }
          this.sendData.sendMessage(obj);
        }
      } else {
        console.log("Candidate not found")
      }
    });
  }

  socketProgres() {
    //for singlelogin
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
}
