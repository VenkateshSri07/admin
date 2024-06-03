import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUtils } from '../../admin.utils';
import { ScheduleAPIService } from 'src/app/rest-api/schedule-api/schedule-api.service';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import _ from 'lodash';
import { UserAPIService } from 'src/app/rest-api/user-api/user-api.service';
import { InstructionScheduleComponent } from '../candidate-shedule-common/instruction-schedule/instruction-schedule.component';
import { SentData } from 'src/app/rest-api/sendData';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddcriteriaComponent } from '../candidate-shedule-common/addcriteria/addcriteria.component';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
// import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { differenceInCalendarDays, setHours } from 'date-fns';
@Component({
  selector: 'app-edit-schedule-package',
  templateUrl: './edit-schedule-package.component.html',
  styleUrls: ['./edit-schedule-package.component.scss']
})
export class EditSchedulePackageComponent implements OnInit {
  criteriaForm: FormGroup;
  form_criteriaArray = 'testDetails';
  form_cri_startTime = 'startTime';
  form_cri_breakTime = 'breakTime';
  form_cri_startDuration = 'startDuration';
  form_cri_duration = 'duration';
  form_cri_id = 'taskTemplateId';
  form_cri_name = 'name';
  form_cri_subType = 'subType';
  form_cri_type = 'type';
  form_cri_endTime = 'endTime';
  form_cri_level = 'level';
  form_cri_criteria = 'criteriaDet';
  assessmentFeedbacklevel: any;
  criteria = 'criteria';
  criteriaId = 'criteriaId';
  condtiton = 'condtiton';
  percentage = 'percentage';
  successMsg = 'successMsg';
  failureMsg = 'failureMsg';
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  disableTextbox = false;
  today = new Date();
  scheduleData: any;
  subscription: any;
  batchDetails: any;
  maxDate: Date;
  minDate: Date;
  selectedbatchId: string;
  selectedbatchName: string;
  reultShowValue: boolean;
  //Time
  batchEndTime: any;
  batchStartTime: any;
  //Date
  scheduleStartDate: any;
  scheduleEndDate: any;
  selectedDate: Date;
  selectedTime: any;
  scheduleDateTimeTimeStamp: string;
  scheduleStartDateTimeTimeStamp: string;
  startDateWithDurations: string;
  is_proctor: any;
  activityTimeRestrict: any;
  status: any;
  packageTemplateName: any;
  is_published: any;
  send_Notification: any;
  publishDate: any;
  publishDateTimeStamp: string;
  showpublishDate = false;
  isUpdateEnable = true;
  candidatedetailsbyid: any;
  candidatelistbyid: any;
  candidatelistbyidtotal: any;
  defaultStartDate: any;
  currentDuration: any;
  profileToUse: any;
  profileUser: any;
  assessmentFeedback: any;
  assessmentFeedbackDisplay: any;
  displaygeneralinstructionbutton: boolean = true;
  isConfirmbtnchange: boolean = true;
  isBtnDisbaled: any;
  getInstructionvalue: any;
  addhtmlValue: any;
  assessmentFlow: any;
  assessmentFlowSequen: any;
  attemptChanges: any;
  startTime: any;
  criteriadetails: any;
  criteriaFormDetails: any;
  taskLengthitem: any;
  instructionsValue: any;
  instructionSvalueUpdate: any;
  editvalues: any;
  driveList: any;
  campusDriveName: any;
  candidateFormname: any;
  candidateFormnamevalue: any;
  instructionshowing: any;
  getFeedbackvalue: any;
  getFeedbackname: any;
  testTimeCheck = false;
  choosetemplate: any;
  chooseName: any;
  selectedTemplateName: any;
  proctorTemplateList: any;
  proctor_tempName: any;
  instructiondisable = false;
  templateId: any;
  isproctorstorevalue: any;
  checkValidationforbutton: any;
  testDetailsvalues: any;
  disabledatepicker1: boolean = false;
  disabledatepicker2: boolean = true;
  disableinprogressdatepicker: boolean = true;
  disabledCss = false;
  successMessage: any;
  Edit_form_Validation: FormGroup;
  showEditButton = false;
  resultData: any;
  reultShow: any;
  constructor(
    private scheduleService: ScheduleAPIService,
    private router: Router,
    private adminUtils: AdminUtils,
    private api: UserAPIService,
    private sendData: SentData,
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private gv: GlobalValidatorService
  ) {
    if (this.router.getCurrentNavigation() !== null && this.router.getCurrentNavigation().extras !== undefined && this.router.getCurrentNavigation().extras.state !== undefined && this.router.getCurrentNavigation().extras.state.data !== undefined) {
      this.getScheduleId(this.router.getCurrentNavigation().extras.state.data)
    } else {
      this.router.navigate(['/admin/schedule/list']);
    }

  }

  ngOnInit(): void {
    this.getCriteriaSuccessMessage();
    this.isUpdateEnable = true;
    this.getEditcriteriaData();
    this.formInitialize();
    this.generalInstructionStatuscheck();
    this.enblaeUpdatebtn();
    this.instructionBtnusingUpdatebtn();
    this.getResultNotify();
  }

  instructionBtnusingUpdatebtn() {
    this.sendData.getMessage().subscribe((response: any) => {
      if (response.isBtnDisbaled == true) {
        this.isUpdateEnable = false
      }
      if (response.addhtmlValue != '') {
        this.showEditButton = true
        this.checkValidationforbutton = 1
      } else {
        this.showEditButton = false
        this.checkValidationforbutton = 0
      }
    })
  }

  getScheduleId(data) {
    let data1 = {
      scheduleId: data.id
    }
    this.api.getScheduleDetails(data1).subscribe((response: any) => {
      if (response.success) {
        this.batchDetails = response.data[0];
        if (this.batchDetails) {
          this.patchingEditDetails(this.batchDetails)
          this.instructionsetvalues();
          this.CandidateIdDetails();
          // this.getCandidateform();
          // this.getFeedbackform();
          this.chooseTemplatevalue();
          this.chooseResultNoifty();
          this.getassessmentForm();
          this.getdriveList();
        }
      } else {
        this.router.navigate(['/admin/schedule/list']);
      }
    })
  }


  patchingEditDetails(batchDetails) {
    this.assessmentFlow = batchDetails.attributes.assessmentFlow;
    this.assessmentFlowSequen = batchDetails.attributes.assessmentFlow;
    this.is_proctor = batchDetails.attributes.is_proctor;
    this.proctor_tempName = batchDetails.attributes.proctor_tempName;
    this.is_published = batchDetails.attributes.is_published;
    this.send_Notification = batchDetails.attributes.send_Notification;
    const selectedDate: Date = batchDetails.attributes.startDateTime;
    this.defaultStartDate = new Date();
    const selectedEndDate: Date = batchDetails.attributes.endDateTime;
    const duration = batchDetails.attributes.duration;
    this.currentDuration = batchDetails.attributes.duration;
    this.instructionsValue = batchDetails && batchDetails.attributes && batchDetails.attributes.instructionFlag;
    this.checkValidationforbutton = batchDetails && batchDetails.attributes && batchDetails.attributes.instructionFlag
    this.status = batchDetails.attributes.status;
    this.publishDate = batchDetails.attributes.publishDate ? batchDetails.attributes.publishDate : new Date();
    this.startDateWithDurations = moment(selectedDate).add(duration, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
    this.formValidation(batchDetails);
    // this.formAttemptvalidation(batchDetails);
    this.detectChanges();
    if (this.batchDetails?.attributes.orgId) {
      this.getProctorTemplate();
    }
    // Start date and time
    this.scheduleStartDate = new Date(selectedDate);
    this.batchStartTime = this.formatAMPM(this.scheduleStartDate);
    // End date and time
    this.scheduleEndDate = new Date(selectedEndDate);
    this.batchEndTime = this.formatAMPM(this.scheduleEndDate);
    // this.publishDate = new Date(publishdate);
    // this.publishTime = this.formatAMPM(this.publishDate);
    this.maxDate = this.scheduleStartDate;
    this.minDate = this.scheduleEndDate;

    if (batchDetails && batchDetails.attributes && batchDetails.attributes.formTemplateId) {
      this.getProfileFormToUse(batchDetails && batchDetails.attributes ? batchDetails.attributes.campusDriveId : '');
    }

    if (this.status == 'InProgress') {
      this.disabledatepicker2 = false;
      this.disabledatepicker1 = true;
      this.disableinprogressdatepicker = true
    }


  }
  // Criteria based button disable and enable update button
  enblaeUpdatebtn() {
    this.sendData.getMessage().subscribe((response) => {
      if (response.editscheduleupdatebtn == true) {
        this.isUpdateEnable = false
      } else {
        this.isUpdateEnable = true
      }
    })
  }

  // instruction set value



  instructionsetvalues() {
    let data = {
      scheduleId: this.batchDetails && this.batchDetails.id
    }
    this.api.getInstruction(data).subscribe((response: any) => {
      if (response.success == true) {
        sessionStorage.setItem("InstructionValue", response.data[0].instructionHtml)
        this.showEditButton = true;
      } else {
        this.showEditButton = false;
        sessionStorage.setItem("InstructionValue", '')
      }
    })
  }
  generalInstructionStatuscheck() {
    if (this.status == 'InProgress') {
      this.instructiondisable = true;
    } else {
      this.instructiondisable = false;
    }
  }

  chooseTemplatevalue() {
    this.choosetemplate = this.batchDetails?.attributes.chooseTemplatename;
    if (this.choosetemplate && this.choosetemplate == 1) {
      this.chooseName = 'Default Template';
    } else if (this.choosetemplate == 2) {
      this.chooseName = 'Bajaj GCT Template';
    }
  }

  chooseResultNoifty() {
    this.reultShow = this.batchDetails?.attributes.campusDriveName;
    if (this.reultShow == "0") {
      this.reultShowValue = false;
    }
    else {
      this.reultShowValue = true
    }
  }
  CandidateIdDetails() {
    const obj = {
      scheduleId: this.batchDetails?.id
    };
    this.scheduleService.CandidateDetailsParticular(obj).subscribe(
      (response: any[]) => {
        this.candidatedetailsbyid = response;
        this.candidatelistbyid = this.candidatedetailsbyid.data;
        this.candidatelistbyidtotal = this.candidatedetailsbyid.data?.length;
        this.patch();
      },
      (error) => { }
    );
  }
  patch() {
    this.getsequentialArr.clear();
    let taskLength = this.candidatelistbyid?.length; // To disabled last break time input box
    this.candidatelistbyid?.forEach((element, i) => {
      this.getsequentialArr?.push(this.pathching(element, i, taskLength));
    });
  }
  formInitialize() {
    this.criteriaForm = this.fb.group({
      [this.form_criteriaArray]: this.fb.array([])
    });
  }

  pathching(data, i, taskLength) {
    // this.ifCriteriaDetails(data)
    return this.fb.group({
      [this.form_cri_duration]: [data.duration, [Validators.required]],
      [this.form_cri_id]: [data.taskTemplateId],
      [this.form_cri_type]: [data.type],
      [this.form_cri_name]: [data.taskName],
      [this.form_cri_endTime]: [data.endTime],
      // [this.form_cri_criteria]: [data.criteriaDet],
      [this.form_cri_level]: [this.assessmentFeedbacklevel],
      [this.form_cri_startTime]: [data.startTime, i == 0 ? [Validators.required] : []],
      [this.form_cri_startDuration]: [data.startDuration, [Validators.required, this.gv.numberOnly(), Validators.maxLength(6)]],
      [this.form_cri_breakTime]: [i != taskLength - 1 ? (data ? data.breakTime : null) : { value: null, disabled: true }, [this.gv.numberOnly(), Validators.maxLength(3)]],
      criteriaDet: this.fb.array([data.criteriaDet])
    });
  }

  // Calucate Schedule Date Time
  onSequentialStartDateChange(date: Date, index) {
    // let preTaskStartDateTime = new Date();
    // let currentTaskDateTime = new Date();
    // let preStartDuration = 0;
    // let preBreakTime = 0;
    // let preDuration = '';
    this.testTimeCheck = true;
    // if (index != 0) {
    //   // Skip index 0 for dateTime validation
    //   preTaskStartDateTime = new Date(this.getsequentialArr.controls[index - 1]['controls'][this.form_cri_startTime].value);
    //   preStartDuration = this.getsequentialArr.controls[index - 1]['controls'][this.form_cri_startDuration].value ? parseInt(this.getsequentialArr.controls[index - 1]['controls'][this.form_cri_startDuration].value): 0;
    //   preDuration = this.getsequentialArr.controls[index - 1]['controls'][this.form_cri_startDuration].value;
    //   preBreakTime = this.getsequentialArr.controls[index - 1]['controls'][this.form_cri_breakTime].value;

    //   currentTaskDateTime = new Date(this.getsequentialArr.controls[index]['controls'][this.form_cri_startTime].value);
    //   // this.isAfterScheduleDateTIme(preTaskStartDateTime,preStartDuration,preDuration,currentTaskDateTime,index,preBreakTime);

    // }
    this.startDuration('', index, this.getsequentialArr?.controls?.length, '')
    this.isUpdateEnable = false;
  }

  // isAfterScheduleDateTIme(preTaskStartDateTime,preStartDuration,preDuration,currentTaskDateTime,index,preBreakTime) {
  // this.startDuration('',index,this.getsequentialArr?.controls?.length)
  // let calucatePreDateTime = 0;
  // calucatePreDateTime = preDuration + preStartDuration + preBreakTime;
  // preTaskStartDateTime = preTaskStartDateTime.setTime(preTaskStartDateTime.getTime() + calucatePreDateTime * 60 * 1000);
  // preTaskStartDateTime = new Date(preTaskStartDateTime).toISOString();
  // const dateIsBefore = moment(preTaskStartDateTime).isBefore(moment(currentTaskDateTime));
  // if (dateIsBefore) {
  // } else {
  //   this.sendData.warning('Schedule start on should be greater than previous schedule starts on and test durations');
  // }
  // }

  // Start Duration
  startDuration(event, index, taskLength, checkDisabled) {
    if (checkDisabled == false && checkDisabled == '') {
      let currentStartDuration = 0;
      let currentTaskStartDateTime;
      let currentBreakTime = 0;
      let taskDuration = '';
      this.testTimeCheck = true;
      currentStartDuration = this.getsequentialArr.controls[index]['controls'].startDuration.value ? parseInt(this.getsequentialArr.controls[index]['controls'].startDuration.value) : 0;
      currentTaskStartDateTime = this.getsequentialArr.controls[index]['controls'].startTime.value ? new Date(this.getsequentialArr.controls[index]['controls'].startTime.value) : '';
      currentBreakTime = this.getsequentialArr.controls[index]['controls'].breakTime.value ? parseInt(this.getsequentialArr.controls[index]['controls'].breakTime.value) : 0;
      taskDuration = this.getsequentialArr.controls[index]['controls'].duration.value ? this.getsequentialArr.controls[index]['controls'].duration.value : 0;
      if (this.getsequentialArr.controls[index]['controls'].startTime.value != '') {
        this.calculateTaskEndDateTime(currentStartDuration, currentTaskStartDateTime, index, taskLength, currentBreakTime, taskDuration); // Calculate each test end date time for passing
      }
    }

  }

  // Calculate each task end time for passing to backend
  calculateTaskEndDateTime(currentStartDuration, currentTaskStartDateTime, index, taskLength, currentBreakTime, taskDuration) {
    if (index != this.getsequentialArr.controls.length - 1) {
      let calucateTime = currentStartDuration + currentBreakTime + taskDuration;
      let endTimeWithTestDuration = currentStartDuration + taskDuration;
      let startTime = currentTaskStartDateTime.setTime(currentTaskStartDateTime.getTime() + calucateTime * 60 * 1000);
      this.getsequentialArr.controls[index + 1]['controls'].startTime.setValue(new Date(startTime).toISOString());

      // calculate test end time
      let calucateEndDateTime = this.getsequentialArr.controls[index]['controls'].startTime.value ? new Date(this.getsequentialArr.controls[index]['controls'].startTime.value) : new Date();
      let endTime = calucateEndDateTime.setTime(calucateEndDateTime.getTime() + endTimeWithTestDuration * 60 * 1000);
      this.getsequentialArr.controls[index]['controls'].endTime.setValue(new Date(endTime).toISOString());
    }

    if (index == 0) {
      // Set Schedule Start DateTime
      this.scheduleStartDate = '';
      currentStartDuration = this.getsequentialArr.controls[index]['controls'].startDuration.value ? parseInt(this.getsequentialArr.controls[index]['controls'].startDuration.value) : 0;
      currentTaskStartDateTime = this.getsequentialArr.controls[index]['controls'].startTime.value ? new Date(this.getsequentialArr.controls[index]['controls'].startTime.value) : new Date();
      // let startTime = currentTaskStartDateTime.setTime(currentTaskStartDateTime.getTime() + (currentStartDuration * 60 * 1000));
      // this.schedulePackageForm.get('scheduleDate').setValue(new Date(startTime).toISOString());
      this.scheduleStartDate = new Date(currentTaskStartDateTime).toISOString();
    }

    // Setting test details end time for last index
    if (index == this.getsequentialArr.controls.length - 1) {
      currentTaskStartDateTime = new Date();
      currentStartDuration = this.getsequentialArr.controls[index]['controls'].startDuration.value ? parseInt(this.getsequentialArr.controls[index]['controls'].startDuration.value) : 0;

      // set last index test end datetime
      let endTime = '';
      currentTaskStartDateTime = this.getsequentialArr.controls[index]['controls'].startTime.value ? new Date(this.getsequentialArr.controls[index]['controls'].startTime.value) : new Date();
      endTime = currentTaskStartDateTime.setTime(currentTaskStartDateTime.getTime() + (currentStartDuration + taskDuration) * 60 * 1000);
      this.getsequentialArr.controls[index]['controls'].endTime.setValue(new Date(endTime).toISOString());

      // Set Schedule End Date
      this.scheduleEndDate = new Date(endTime).toISOString();
    }
    this.isUpdateEnable = false;
    // this.getAddcriteriaData()
  }

  // Break Time   new
  breakTime(event, index, checkDisabled) {
    if (checkDisabled == false) {
      let lastTaskStartDateTime;
      let lastStartDuration = 0;
      let lastBreakTime = 0;
      let TaskDuration = '';
      this.testTimeCheck = true;
      if (index != this.getsequentialArr.controls.length - 1) {
        if (event && event.target && event.target.value == '') {
          this.getsequentialArr.controls[index + 1]['controls'].startTime.enable();
          lastTaskStartDateTime = this.getsequentialArr.controls[index]['controls'].startTime.value ? new Date(this.getsequentialArr.controls[index]['controls'].startTime.value) : '';
          lastStartDuration = this.getsequentialArr.controls[index]['controls'].startDuration.value ? parseInt(this.getsequentialArr.controls[index]['controls'].startDuration.value) : 0;
          lastBreakTime = 0;
          TaskDuration = this.getsequentialArr.controls[index]['controls'].duration.value ? this.getsequentialArr.controls[index]['controls'].duration.value : 0;
          if (this.getsequentialArr.controls[index]['controls'].startTime.value != '') {
            this.getCalucateNextTaskStartTime(lastTaskStartDateTime, lastStartDuration, lastBreakTime, TaskDuration, index);
          }
        } else {
          // Calucate if break time
          lastTaskStartDateTime = this.getsequentialArr.controls[index]['controls'].startTime.value ? new Date(this.getsequentialArr.controls[index]['controls'].startTime.value) : '';
          lastStartDuration = this.getsequentialArr.controls[index]['controls'].startDuration.value ? parseInt(this.getsequentialArr.controls[index]['controls'].startDuration.value) : 0;
          lastBreakTime = this.getsequentialArr.controls[index]['controls'].breakTime.value ? parseInt(this.getsequentialArr.controls[index]['controls'].breakTime.value) : 0;
          TaskDuration = this.getsequentialArr.controls[index]['controls'].duration.value ? this.getsequentialArr.controls[index]['controls'].duration.value : 0;
          if (this.getsequentialArr.controls[index]['controls'].startTime.value != '') {
            this.getCalucateNextTaskStartTime(lastTaskStartDateTime, lastStartDuration, lastBreakTime, TaskDuration, index);
          }
        }
      }
      if (index != 1 && this.getsequentialArr && this.getsequentialArr.controls && this.getsequentialArr.controls[index - 1] && this.getsequentialArr.controls[index - 1]['controls'] && this.getsequentialArr.controls[index - 1]['controls'].breakTime.value) {
        this.disabledCss = true
      } else {
        this.disabledCss = false
      }
    }
  }
  getCalucateNextTaskStartTime(startDateTime, startDuration, breakTime, taskDuration, index) {
    let calucateTime = taskDuration + startDuration + breakTime;
    let startTime = startDateTime.setTime(startDateTime.getTime() + calucateTime * 60 * 1000);
    this.getsequentialArr.controls[index + 1]['controls'].startTime.setValue(
      new Date(startTime).toISOString()
    );
  } // End Break Time



  get getsequentialArr() {
    return this.criteriaForm.get([this.form_criteriaArray]) as FormArray;
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  checkFinalDateTime() {
    let startTimes = [];
    let endTimes = [];
    let startDateTime = new Date('');
    this.getsequentialArr.value.forEach((element) => {
      endTimes.push(new Date(_.pick(element, ['endTime']).endTime).toISOString());
      if (
        element.breakTime != '' &&
        element.breakTime != null &&
        element.breakTime != 0 &&
        element.breakTime != '0' &&
        element.breakTime == ''
      ) {
        startTimes.push(new Date(_.pick(element, ['startTime']).startTime).toISOString());
      } else {
        startDateTime = new Date(element.startTime);
        let passStartDateTime = new Date(startDateTime);
        startTimes.push(
          new Date(passStartDateTime.setMinutes(startDateTime.getMinutes() + 1)).toISOString()
        );
      }
      this.isUpdateEnable = false;
      this.disabledatepicker2 = false;
      this.disabledatepicker1 = true;
      this.disableinprogressdatepicker = true
    });
    // this.testTimeCheck = false;
    const intersection = this.findIntersection(startTimes, endTimes);
    if (intersection !== null) {
      this.testTimeCheck = true;
      this.sendData.warning(
        `Schedule start on datetime mismatched between test ${intersection[0] + 1} and ${intersection[1] + 1
        }`
      );
    } else {
      this.testTimeCheck = false;

    }
  }

  findIntersection(startTimes, endTimes) {
    for (let i = 0; i < startTimes.length; i++) {
      for (let j = i + 1; j < startTimes.length; j++) {
        if (
          (startTimes[i] >= startTimes[j] && startTimes[i] <= endTimes[j]) ||
          (endTimes[i] >= startTimes[j] && endTimes[i] <= endTimes[j]) ||
          (startTimes[j] >= startTimes[i] && startTimes[j] <= endTimes[i]) ||
          (endTimes[j] >= startTimes[i] && endTimes[j] <= endTimes[i])
        ) {
          return [i, j]; // return the indexes of the intersecting intervals
        }
      }
    }
    return null; // no intersection found
  }

  clearScheduleDetails() {
    this.testTimeCheck = true;
    this.disabledatepicker1 = true;
    this.disabledatepicker2 = false;
  }


  onDateChanged(result: Date, scheduleEndDate): void {
    const pathStartvalue = result;
    this.isUpdateEnable = false;
  }
  checkStartDateAndTime(scheduleEndDate, scheduleStartDate) {
    scheduleEndDate = new Date(scheduleEndDate).toISOString();
    this.isUpdateEnable = false;
    const dateIsAfter = moment(scheduleEndDate).isAfter(moment(scheduleStartDate));
  }

  onEndDateChanged(event: Date, scheduleStartDate): void {
    const pathEndValue = event;
    this.isUpdateEnable = false;
  }
  checkEndDateAndTime(scheduleStartDate, scheduleEndDate) {
    scheduleStartDate = new Date(scheduleStartDate).toISOString();
    this.isUpdateEnable = false;
    const dateIsBefore = moment(scheduleStartDate).isBefore(moment(scheduleEndDate));
  }


  onPublishTimeChanged(time: any) {
    // this.canCreateSchedule = true;
  }

  onOkStartDateAndTime(event) {
    this.scheduleStartDate = new Date(event).toISOString();
    this.isUpdateEnable = false;
  }
  onOkEndDateAndTime(event) {
    this.scheduleEndDate = new Date(event).toISOString();
    this.isUpdateEnable = false;
  }
  onpublishDateChanged(event: Date): void {
    this.publishDate = new Date(event).toISOString();
    // this.canCreateSchedule = true;
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };

  // display compusdrivename
  getdriveList() {
    this.api.getCampusDriveList({}).subscribe((data: any) => {
      if (data.success) {
        this.driveList = data.data;
        this.driveList.forEach((element) => {
          if (element.drive_master_id == parseInt(this.batchDetails?.attributes.campusDriveName)) {
            this.campusDriveName = element.drive_name;
          }
        });
      } else {
        this.sendData.warning(data.message);
      }
    });
  }

  getResultNotify() {
    this.api.resultNotification().subscribe((response: any) => {
      if (response.success) {
        this.resultData = response.data;
      } else {
        this.sendData.warning(response.message);
      }
    })
  }
  // getCandidateform() {
  //   let obj = {
  //     orgId: this.batchDetails?.attributes.orgId
  //   };
  //   this.scheduleService.getProfiletouse(obj).subscribe((response: any) => {
  //     this.candidateFormnamevalue = response.data;
  //     if (this.candidateFormnamevalue) {

  //     }
  //   });
  // }
  // getFeedbackform() {
  //   this.api.getAssessmentFormToUse().subscribe((response: any) => {
  //     this.getFeedbackvalue = response.data;
  //     this.getFeedbackvalue.forEach((element) => {
  //       if (element.feedbackFormId == this.batchDetails?.attributes.feedbackFormId) {
  //         this.getFeedbackname = element.feedbackFormName;
  //       }
  //     });
  //   });
  // }

  displayGeneral(event) {
    if (event.value == '1') {
      this.displaygeneralinstructionbutton = false;
      this.instructionSvalueUpdate = event.value;
      this.instructionsValue = event.value;
      this.isUpdateEnable = false
    } else if (event.value == '0') {
      this.displaygeneralinstructionbutton = true;
      this.instructionSvalueUpdate = event.value;
      this.isUpdateEnable = false
      this.instructionsValue = event.value;
      sessionStorage.setItem('InstructionValue', '')
    } else {
      this.displaygeneralinstructionbutton = true;
    }
  }

  isproctorChange(event) {
    this.is_proctor = event.value
    this.isUpdateEnable = false;
  }



  checkValidation() {
    let checkInstruction = sessionStorage.getItem('InstructionValue') ? sessionStorage.getItem('InstructionValue') : null;
    if (this.instructionsValue == 0) {
      this.updateSchedule();
    }
    else {
      if (this.instructionsValue == 1 && checkInstruction != null) {
        this.updateSchedule();
      } else {
        this.sendData.warning('Please fill the instructions');
      }
    }
  }


  checkcriteriaValidation() {
    let criteriaarr: any = [];
    let formArrayvalue = [];
    if (this.criteriaForm && this.criteriaForm.controls && this.criteriaForm.controls.testDetails) {
      formArrayvalue = this.criteriaForm.controls.testDetails.value;
      criteriaarr = []
      formArrayvalue.forEach(element => {
        if (element && element.criteriaDet && element.criteriaDet.length > 0) {
          element.criteriaDet[element.criteriaDet.length - 1].criteriaDet.forEach(element => {
            criteriaarr.push(element)
          });
        }
      });
      this.testDetailsvalues = _.find(criteriaarr, function (criteria) {
        if (criteria.criteria == "Proctor Score") {
          return criteria.criteria == "Proctor Score";
        } else {
          return false;
        }
      })
    }
    return this.testDetailsvalues && this.testDetailsvalues.criteria == 'Proctor Score' ? true : false;
  }

  updateSchedule() {
    if (this.Edit_form_Validation.status != 'INVALID') {
      if ((this.is_proctor == 1 && this.proctor_tempName != null) || (this.is_proctor == 0)) {
        const concatedDateTime = this.scheduleEndDate;
        this.scheduleDateTimeTimeStamp = new Date(concatedDateTime).toISOString();
        const concatedOnDateTime = this.scheduleStartDate;
        this.scheduleStartDateTimeTimeStamp = new Date(concatedOnDateTime).toISOString();
        this.startDateWithDurations = moment(this.scheduleStartDateTimeTimeStamp).add(this.currentDuration, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
        if (this.assessmentFlow == 'parallel') {
          let data = {
            scheduleId: this.batchDetails.id,
            startTime: this.scheduleStartDateTimeTimeStamp,
            endTime: this.scheduleDateTimeTimeStamp,
            publishDate: new Date(this.publishDate).toISOString(),
            assessmentFlow: this.assessmentFlow,
            is_published: this.is_published,
            is_proctor: this.is_proctor,
            status: this.batchDetails.attributes.status,
            instructionHtml: sessionStorage.getItem('InstructionValue'),
            instructionFlag: this.instructionSvalueUpdate ? this.instructionsValue : this.instructionsValue,
            proctor_tempName: this.proctor_tempName,
            totalTestDuration: this.candidatedetailsbyid?.totalDuration,
            testDetails: this.candidatelistbyid,
            templateId: this.proctor_tempName ? this.templateId : null,
            browserTolerance: '0',
            idealTimeCapture: '0',
            idealTimePopupDuration: '0',
            attemptRestrict: '0',
            numberOfattempt: null,
            activityTimeRestrict: '0',
            activityTimeDuration: null,
            resultNotifySuccess: this.Edit_form_Validation.value.resultNotifySuccess,
            resultNotifySuccessTemplate: this.Edit_form_Validation.value.resultNotifySuccessTemplate,
            resultNotifyFailure: this.Edit_form_Validation.value.resultNotifyFailure,
            resultNotifyFailureTemplate: this.Edit_form_Validation.value.resultNotifyFailureTemplate,

          };
          this.scheduleService.updateScheduleEndDate(data).subscribe((response: any) => {
            if (response.success) {
              this.sendData.success(response.message);
              this.router.navigate(['/admin/schedule/list']);
              sessionStorage.removeItem('InstructionValue');
            } else {
              this.sendData.warning(response.message);
            }
          });
        } else {
          this.checkcriteriaValidation();
          let formValues = this.criteriaForm.getRawValue();
          if (this.criteriaForm.valid) {
            if (this.assessmentFlow == 'sequential' && this.checkcriteriaValidation() == true && this.is_proctor == '0') {
              this.sendData.warning('If you select proctor score in add criteria please select Yes in proctor check');
              if (this.assessmentFlow == 'sequential' && this.testTimeCheck == true) {
                this.sendData.warning('Please click on check');
              }
            } else {
              let data = {
                scheduleId: this.batchDetails.id,
                startTime: this.scheduleStartDateTimeTimeStamp,
                endTime: this.scheduleDateTimeTimeStamp,
                assessmentFlow: this.assessmentFlow,
                publishDate: this.publishDate,
                is_published: this.is_published,
                is_proctor: this.is_proctor,
                status: this.batchDetails.attributes.status,
                instructionHtml: sessionStorage.getItem('InstructionValue'),
                testDetails: this.criteriaForm.value.testDetails,
                instructionFlag: this.instructionSvalueUpdate ? this.instructionsValue : this.instructionsValue,
                proctor_tempName: this.proctor_tempName,
                templateId: this.proctor_tempName ? this.templateId : null,
                browserTolerance: '0',
                idealTimeCapture: '0',
                idealTimePopupDuration: '0',
                attemptRestrict: '0',
                numberOfattempt: null,
                activityTimeRestrict: '0',
                activityTimeDuration: null,
                resultNotifySuccess: this.Edit_form_Validation.value.resultNotifySuccess,
                resultNotifySuccessTemplate: this.Edit_form_Validation.value.resultNotifySuccessTemplate,
                resultNotifyFailure: this.Edit_form_Validation.value.resultNotifyFailure,
                resultNotifyFailureTemplate: this.Edit_form_Validation.value.resultNotifyFailureTemplate,
              };

              this.scheduleService.updateScheduleEndDate(data).subscribe((response: any) => {
                if (response.success) {
                  this.sendData.success(response.message);
                  this.router.navigate(['/admin/schedule/list']);
                  sessionStorage.removeItem('InstructionValue');
                } else {
                  this.sendData.warning(response.message);
                }
              });

            }
          }

        }
      } else {
        this.sendData.warning('Please choose template');
      }
    } else {
      this.sendData.warning('Please fill all required fields')
    }
  }

  getConcatedDateTime(selectedEndDate: Date, scheduleEndTime: string): string {
    return (
      selectedEndDate?.toString().substring(0, 15) +
      ' ' +
      this.adminUtils.timeConversion(scheduleEndTime)
    );
  }

  ispublishChange(event) {
    if (this.is_published == true) {
      this.is_published = 0;
    } else {
      this.is_published = 1;
    }
    this.isUpdateEnable = false;
  }


  getDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    if (duration == 60) {
      return `${hours} Hr`;
    } else if (hours > 0 && mins > 0) {
      if (hours == 1) {
        return `${hours} Hr ${mins} Mins`;
      }
      return `${hours} Hrs ${mins} Mins`;
    } else if (hours > 0) {
      return `${hours} Hrs`;
    } else {
      return `${mins} Mins`;
    }
  }

  getProfileFormToUse(org) {
    // let data = {
    //   orgId: org ? parseInt(org) : org
    // }
    let data = {
      orgId: this.batchDetails.attributes.orgId
    };
    this.scheduleService.getProfiletouse(data).subscribe((response: any) => {
      if (response.success && this.batchDetails && this.batchDetails.attributes) {
        this.profileToUse = response.data;
        this.profileToUse.splice(0, 0, { formTemplateId: 0, formTemplateName: 'None' });
        // Getting Profileuser id and filtering form array
        let profileName = _.find(this.profileToUse, {
          formTemplateId: this.batchDetails?.attributes?.formTemplateId
        });

        this.profileToUse.forEach((element) => {
          if (element.formTemplateId == this.batchDetails?.attributes.formTemplateId) {
            this.candidateFormname = element.formTemplateName;
          }
        });
        this.profileUser = profileName ? profileName.formTemplateName : '';
      } else {
        this.sendData.warning(response.message);
      }
    });
  }

  getassessmentForm() {
    this.api.getAssessmentFormToUse().subscribe((data: any) => {
      if (data.success) {
        this.assessmentFeedback = data.data;
        this.assessmentFeedbacklevel = data.level;
        this.assessmentFeedback.splice(0, 0, { feedbackFormId: 0, feedbackFormName: 'None' });
        let feedbackName = _.find(this.assessmentFeedback, {
          feedbackFormId: this.batchDetails?.attributes?.feedbackFormId
        });
        this.assessmentFeedback.forEach((element) => {
          if (element.feedbackFormId == this.batchDetails?.attributes.feedbackFormId) {
            this.getFeedbackname = element.feedbackFormName;
          }
        });
        this.assessmentFeedback = feedbackName ? feedbackName.feedbackFormName : '';
      } else {
        this.sendData.warning(data.message);
      }
    });
  }

  addDisplayInstructions() {
    let data = {
      scheduleId: this.batchDetails?.id
    };
    this.api.getInstruction(data).subscribe((response: any) => {
      if (response.success) {
        this.addhtmlValue = response.data[0]?.instructionHtml;
        sessionStorage.setItem('InstructionValue', this.addhtmlValue);
        this.matDialog.open(InstructionScheduleComponent, {
          width: '60%',
          height: '100%',
          autoFocus: false,
          closeOnNavigation: true,
          disableClose: true,
          position: { right: '0' },
          data: {
            instruction: this.addhtmlValue,
            status: this.batchDetails.attributes.status
          }
        });
      } else if (this.instructionSvalueUpdate == 1) {
        // localStorage.removeItem('InstructionValue');
        this.matDialog.open(InstructionScheduleComponent, {
          width: '60%',
          height: '100%',
          autoFocus: false,
          closeOnNavigation: true,
          disableClose: true,
          position: { right: '0' }
        });
      }
    });
    this.isUpdateEnable = false;
  }

  addDisplayInstructionsvisible() {
    let data = {
      isConfirmbtnchange: this.isConfirmbtnchange,
      getSessiondata: sessionStorage.getItem('InstructionValue')
    };
    this.matDialog.open(InstructionScheduleComponent, {
      width: '60%',
      height: '100%',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      position: { right: '0' }
    });
    this.sendData.sendMessage(data);
  }

  editCriteria(item, index, formArr, type, typevaluetext) {
    var addcriteria = this.matDialog.open(AddcriteriaComponent, {
      width: '55%',
      height: '100%',
      autoFocus: false,
      closeOnNavigation: false,
      disableClose: true,
      position: { right: '0' },
      data: {
        dataKey: item,
        key: '1',
        index: index,
        form: formArr,
        status: this.batchDetails.attributes.status,
        type: type,
        successMessage: this.successMessage
      }
    });
  }

  getEditcriteriaData() {
    this.sendData.getMessage().subscribe((data) => {
      if (data && data.criteriaFormValue) {
        this.criteriaForm.value.testDetails[data.index].criteriaDet.push(data.criteriaFormValue);
      }
    });
  }

  getProctorTemplate() {
    this.proctorTemplateList = [];
    this.scheduleService.getProctorTemplateName(this.batchDetails?.attributes.orgId).subscribe((response: any) => {
      if (response.success) {
        this.proctorTemplateList = response.data;
        if (this.proctor_tempName == null || this.proctor_tempName == '') {
          this.proctor_tempName = response.data ? response.data[0].tempname : '';
        }

        this.proctorTemplateList.forEach((element) => {
          if (element.tempname == this.proctor_tempName) {
            this.templateId = element.templateId;

          }
        })
      } else {
        this.sendData.warning(response.message);
      }
    });
  }
  selectTemplate(templateDetails, data) {
    data.forEach((element) => {
      if (element.tempname == templateDetails) {
        this.proctor_tempName = element.tempname;
        this.templateId = element.templateId;
        this.isUpdateEnable = false;
      }
    });
  }

  getCriteriaSuccessMessage() {
    let data = {
      scheduleId: '000'
    }

    this.api.getAssessmentTaskCriteria(data).subscribe((resData: any) => {
      if (resData.success) {
        this.successMessage = resData.data[0].successMsg;
        // this.formInitialize();
      } else {
        // this.formInitialize();
      }

    })
  }
  formValidation(batchDetails) {
    this.Edit_form_Validation = this.fb.group({
      'browserTolerance': [{ value: batchDetails && batchDetails.attributes ? batchDetails.attributes.browserTolerance : null, disabled: batchDetails.attributes.status == 'InProgress' }, [Validators.required, this.gv.numberOnly(), this.gv.twoDigit()]],
      'idealTimeCapture': [{ value: batchDetails && batchDetails.attributes ? batchDetails.attributes.idealTimeCapture : null, disabled: batchDetails.attributes.status == 'InProgress' }, [Validators.required, this.gv.numberOnly(), this.gv.twoDigit()]],
      'idealTimePopupDuration': [{ value: batchDetails && batchDetails.attributes ? batchDetails.attributes.idealTimePopupDuration : null, disabled: batchDetails.attributes.status == 'InProgress' }, [Validators.required, this.gv.numberOnly(), this.gv.threeDigit()]],
      // 'attemptRestrict': [{ value: batchDetails && batchDetails.attributes ? batchDetails.attributes.attemptRestrict : '0', disabled: batchDetails.attributes.status == 'InProgress' }, [this.gv.numberOnly()]],
      // 'numberOfattempt': [batchDetails && batchDetails.attributes ? batchDetails.attributes.numberOfattempt : null, [this.gv.numberOnly(), this.gv.twoDigit()]],
      // 'activityTimeRestrict': [{ value: batchDetails && batchDetails.attributes ? batchDetails.attributes.activityTimeRestrict : '0', disabled: batchDetails.attributes.status == 'InProgress' }, [this.gv.numberOnly()]],
      // 'activityTimeDuration': [batchDetails && batchDetails.attributes ? batchDetails.attributes.activityTimeDuration : null, [this.gv.numberOnly(), this.gv.twoDigit()]],
      'resultNotifySuccess': [{ value: batchDetails && batchDetails.attributes ? batchDetails.attributes.resultNotifySuccess : '0', disabled: batchDetails.attributes.status == 'InProgress' }, [Validators.required]],
      'resultNotifySuccessTemplate': [{ value: batchDetails && batchDetails.attributes ? batchDetails.attributes.resultNotifySuccessTemplate : null, disabled: batchDetails.attributes.status == 'InProgress' }],
      'resultNotifyFailure': [{ value: batchDetails && batchDetails.attributes ? batchDetails.attributes.resultNotifyFailure : '0', disabled: batchDetails.attributes.status == 'InProgress' }, [Validators.required]],
      'resultNotifyFailureTemplate': [{ value: batchDetails && batchDetails.attributes ? batchDetails.attributes.resultNotifyFailureTemplate : null, disabled: batchDetails.attributes.status == 'InProgress' }],
    });

  }
  resetingForm() {
    // this.Edit_form_Validation.controls.attemptRestrict.setValue('0');
    // this.Edit_form_Validation.controls.attemptRestrict.markAsUntouched();
    // this.Edit_form_Validation.controls.attemptRestrict.updateValueAndValidity({ emitEvent: false });

    // this.Edit_form_Validation.controls.activityTimeRestrict.setValue('0')
    // this.Edit_form_Validation.controls.activityTimeRestrict.markAsUntouched();
    // this.Edit_form_Validation.controls.activityTimeRestrict.updateValueAndValidity({ emitEvent: false });

    // this.Edit_form_Validation.controls.resultNotifySuccess.setValue('0')
    // this.Edit_form_Validation.controls.resultNotifySuccess.markAsUntouched();
    // this.Edit_form_Validation.controls.resultNotifySuccess.updateValueAndValidity({ emitEvent: false });

    this.Edit_form_Validation.controls.resultNotifyFailure.setValue('0')
    this.Edit_form_Validation.controls.resultNotifyFailure.markAsUntouched();
    this.Edit_form_Validation.controls.resultNotifyFailure.updateValueAndValidity({ emitEvent: false });

  }
  // attemptRestructChange(event) {
  //   if (event.value == '1') {
  //     this.Edit_form_Validation.controls.numberOfattempt.setValidators([Validators.required, this.gv.twoDigit()]);
  //     this.Edit_form_Validation.controls.numberOfattempt.updateValueAndValidity();
  //   } else if (event.value == '0') {
  //     this.Edit_form_Validation.controls.numberOfattempt.clearValidators();
  //     this.Edit_form_Validation.controls.numberOfattempt.setValidators(null);
  //     this.Edit_form_Validation.controls.numberOfattempt.setValue(null);
  //     this.Edit_form_Validation.controls.numberOfattempt.markAsUntouched();
  //     this.Edit_form_Validation.controls.numberOfattempt.updateValueAndValidity();
  //   }
  //   else {
  //     this.Edit_form_Validation.controls.numberOfattempt.clearValidators();
  //     this.Edit_form_Validation.controls.numberOfattempt.setValidators(null);
  //     this.Edit_form_Validation.controls.numberOfattempt.markAsUntouched();
  //     this.Edit_form_Validation.controls.numberOfattempt.updateValueAndValidity();
  //   }
  //   this.isUpdateEnable = false;
  // }


  resultNotifySuccessChange(event) {
    if (event.value == '1') {
      this.Edit_form_Validation.controls.resultNotifySuccessTemplate.setValidators([Validators.required]);
      this.Edit_form_Validation.controls.resultNotifySuccessTemplate.updateValueAndValidity();
    } else if (event.value == '0') {
      this.Edit_form_Validation.controls.resultNotifySuccessTemplate.clearValidators();
      this.Edit_form_Validation.controls.resultNotifySuccessTemplate.setValidators(null);
      this.Edit_form_Validation.controls.resultNotifySuccessTemplate.setValue(null);
      this.Edit_form_Validation.controls.resultNotifySuccessTemplate.markAsUntouched();
      this.Edit_form_Validation.controls.resultNotifySuccessTemplate.updateValueAndValidity();
    }
    else {
      this.Edit_form_Validation.controls.resultNotifySuccessTemplate.clearValidators();
      this.Edit_form_Validation.controls.resultNotifySuccessTemplate.setValidators(null);
      this.Edit_form_Validation.controls.resultNotifySuccessTemplate.markAsUntouched();
      this.Edit_form_Validation.controls.resultNotifySuccessTemplate.updateValueAndValidity();
    }
    this.isUpdateEnable = false;
  }
  resultNotifyFailureChange(event) {
    if (event.value == '1') {
      this.Edit_form_Validation.controls.resultNotifyFailureTemplate.setValidators([Validators.required]);
      this.Edit_form_Validation.controls.resultNotifyFailureTemplate.updateValueAndValidity();
    } else if (event.value == '0') {
      this.Edit_form_Validation.controls.resultNotifyFailureTemplate.clearValidators();
      this.Edit_form_Validation.controls.resultNotifyFailureTemplate.setValidators(null);
      this.Edit_form_Validation.controls.resultNotifyFailureTemplate.setValue(null);
      this.Edit_form_Validation.controls.resultNotifyFailureTemplate.markAsUntouched();
      this.Edit_form_Validation.controls.resultNotifyFailureTemplate.updateValueAndValidity();
    }
    else {
      this.Edit_form_Validation.controls.resultNotifyFailureTemplate.clearValidators();
      this.Edit_form_Validation.controls.resultNotifyFailureTemplate.setValidators(null);
      this.Edit_form_Validation.controls.resultNotifyFailureTemplate.markAsUntouched();
      this.Edit_form_Validation.controls.resultNotifyFailureTemplate.updateValueAndValidity();
    }
    this.isUpdateEnable = false;
  }

  // activityTimeChange(event) {
  //   if (event.value == '1') {
  //     this.Edit_form_Validation.controls.activityTimeDuration.setValidators([Validators.required, this.gv.twoDigit()]);
  //     this.Edit_form_Validation.controls.activityTimeDuration.updateValueAndValidity();
  //   } else if (event.value == '0') {
  //     this.Edit_form_Validation.controls.activityTimeDuration.clearValidators();
  //     this.Edit_form_Validation.controls.activityTimeDuration.setValidators(null);
  //     this.Edit_form_Validation.controls.activityTimeDuration.setValue(null);
  //     this.Edit_form_Validation.controls.activityTimeDuration.markAsUntouched();
  //     this.Edit_form_Validation.controls.activityTimeDuration.updateValueAndValidity();
  //   }
  //   else {
  //     this.Edit_form_Validation.controls.activityTimeDuration.clearValidators();
  //     this.Edit_form_Validation.controls.activityTimeDuration.setValidators(null);
  //     this.Edit_form_Validation.controls.activityTimeDuration.markAsUntouched();
  //     this.Edit_form_Validation.controls.activityTimeDuration.updateValueAndValidity();
  //   }
  //   this.isUpdateEnable = false;
  // }



  // get ActivityTimeRestrict() {
  //   return this.Edit_form_Validation.get('activityTimeRestrict');
  // }
  // get activityTimeDuration() {
  //   return this.Edit_form_Validation.get('activityTimeDuration');
  // }
  // get AttemptRestrict() {
  //   return this.Edit_form_Validation.get('attemptRestrict');
  // }
  // get numberOfattempt() {
  //   return this.Edit_form_Validation.get('numberOfattempt');
  // }

  get BrowserTolerance() {
    return this.Edit_form_Validation.get('browserTolerance');
  }

  get IdealTimeCapture() {
    return this.Edit_form_Validation.get('idealTimeCapture');
  }

  get idealTimePopupDuration() {
    return this.Edit_form_Validation.get('idealTimePopupDuration');
  }

  get resultNotifySuccess() {
    return this.Edit_form_Validation.get('resultNotifySuccess');
  }

  get resultNotifySuccessTemplate() {
    return this.Edit_form_Validation.get('resultNotifySuccessTemplate');
  }

  get resultNotifyFailure() {
    return this.Edit_form_Validation.get('resultNotifyFailure');
  }

  get resultNotifyFailureTemplate() {
    return this.Edit_form_Validation.get('resultNotifyFailureTemplate');
  }

  detectChanges() {

    // Fires on each form control value change
    this.Edit_form_Validation.valueChanges.subscribe(res => {
      if (res.browserTolerance == '' || res.idealTimeCapture == '' || res.idealTimePopupDuration == '') {
        this.isUpdateEnable = false;
      } else {
        if (this.Edit_form_Validation.status == 'INVALID') {
          this.isUpdateEnable = true;
        } else {
          this.isUpdateEnable = false;
        }
      }
    });
  }

}
