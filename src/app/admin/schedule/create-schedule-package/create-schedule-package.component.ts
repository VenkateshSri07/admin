import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ScheduleActions from '../redux/schedule.actions';
import { AssesmentPackagesModel, PackageResponse } from 'src/app/rest-api/package-api/model/package-response.model';
import { Observable } from 'rxjs';
import { PackageDetailResponse, PackageDetailsData } from 'src/app/rest-api/package-api/model/package-details.model';
import { selectPackageDetailsState } from '../redux/schedule.reducers';
import { SchedulerReducerState } from '../redux/schedule.model';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { ScheduleAPIService } from 'src/app/rest-api/schedule-api/schedule-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Buffer } from 'buffer';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { AddcriteriaComponent } from '../candidate-shedule-common/addcriteria/addcriteria.component';
import { SentData } from 'src/app/rest-api/sendData';
import { InstructionScheduleComponent } from '../candidate-shedule-common/instruction-schedule/instruction-schedule.component';
import { UserAPIService } from 'src/app/rest-api/user-api/user-api.service';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import * as moment from 'moment';
// import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { PackageAPIService } from 'src/app/rest-api/package-api/package-api.service';
import _ from 'lodash';
@Component({
  selector: 'app-create-schedule-package',
  templateUrl: 'create-schedule-package.html',
  styleUrls: ['create-schedule-package.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateSchedulePackageComponent implements OnInit, OnDestroy {
  @ViewChild('notifications', { static: false }) notifications: TemplateRef<any>;
  @ViewChild('uploadfiles', { static: false }) uploadfiles: TemplateRef<any>;
  @ViewChild('addCriteria', { static: false }) addCriteria: TemplateRef<any>;
  @ViewChild('startDatePicker') startDatePicker!: NzDatePickerComponent;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  checkEmptyFile: boolean;
  today = new Date();
  uploadnamechange: boolean;
  isBtnDisbaled: any;
  getInstructionvalue: any;
  packageList: PackageResponse;
  // Form Fields
  schedulePackageForm: FormGroup;
  addCriteriaDetailsForm: FormGroup;
  filteredOptions: Observable<AssesmentPackagesModel[]> | undefined;
  filteredOptions1: string[] = [];
  options: any[] = []
  packageDetails: PackageDetailsData;
  scheduleDateTime: string;
  scheduleEndDateTime: string;
  disableCreateButton = true;
  // Candidates Information
  toogleAddCandidateInfoButton: boolean;
  toogleUploadCsvButton: boolean = false;
  switchToAddEmailView: boolean;
  showCsvFileInformation: boolean;
  csvRows: Array<any[]> = [];
  csvFileName: string = '';
  // Check Excel Validation Files
  invalidEmailsList: string[] = [];
  validEmailsList: any[] = [];
  invalidInstanceIdList: any[] = [];
  validInstanceIdList: any[] = [];
  firstNameerror: any[] = [];
  invalidFirstname: any[] = [];
  // Bajal Variables
  validgender: any[] = [];
  invalidgender: any[] = [];
  validDegree: any[] = [];
  invalidDegree: any[] = [];
  validSpecialization: any[] = [];
  invalidSpecialization: any[] = [];
  validtenthvalidation: any[] = [];
  invalidtenthvalidation: any[] = [];
  validyearofpassingtenth: any[] = [];
  invalidyearofpassingtenth: any[] = [];
  validtwelfthvalidation: any[] = [];
  invalidtwelfthvalidation: any[] = [];
  validyearofpassingtwelfth: any[] = [];
  invalidyearofpassingtwelfth: any[] = [];
  validBacklogvalidation: any[] = [];
  invalidBacklogvalidation: any[] = [];
  validDiplomavalidation: any[] = [];
  invalidDiplomavalidation: any[] = [];
  validinternvalidation: any[] = [];
  invalidinternvalidation: any[] = [];
  duplicateEmailsListCount = 0;
  uploadFileShow = false;
  files: any = [];
  selectedCSVFile: File;
  scheduleDateTimeTimeStamp: string;
  scheduleEndDateTimeTimeStamp: string;
  publishDateTime: string;
  listOfOrg: any;
  minDate: any;
  maxDate: any;
  minDate1: Date = new Date();
  startTime: any;
  endTime: any;
  currentTime: Date = new Date();
  duration: any;
  orginfo: any = [];
  showProctorTemplate = false;
  showResultEmailNotify: boolean;
  proctorTemplateList: any;
  selectedTemplateName: any;
  notificationsdialogRef: any;
  bufferData: any;
  emailtemplate: any;
  isSendNotificationEnable = true;
  assessmentCodeTick = false;
  isSuccess = false;
  dialogContent: boolean = null;
  flowchange: any;
  displaygeneralinstructionbutton: boolean = true;
  // Upload Files variables
  validFile = false;
  selectedTemplate: any = 1;
  Upload_FirstLevelCandidates = 'Default Template';
  Upload_AssessmentScore = 'Bajaj GCT Template';
  Upload_CandidateAssigntoInterviewPanel = 'Default Template';
  Upload_CandidateAssigneeRemoval = 'Bajaj GCT Template';
  templates: any;
  chooseTemplate: boolean;
  profileToUse: any = [];
  isAssessmentDetailsShow: boolean = false;
  driveList: any;
  assessmentFeedback: any;
  orgInfoDetails: any;
  selectedTemplateId: any;
  showError = false;
  showBajajError = false;
  candidateUrl: any;
  patchStartDate: any;
  patchEndDate: any;
  excelvalue: any;
  criteriaData: any;
  instaidCheck: string;
  testTimeCheck = true;
  uploadPush: any;
  uploadbajaj: any;
  checkinstance: any;
  proctotcriteria: boolean;
  findcriteria: any;
  testDetailsvalues: any;
  dateFlag: boolean;
  excelinstancemessage: any;
  TimeValidationCheckForSequential: Date = new Date();
  successMessage: any;
  newDrive: any;
  resultData: any;
  constructor(
    private fb: FormBuilder,
    private store: Store<SchedulerReducerState>,
    private scheduleService: ScheduleAPIService,
    private toaster: ToastrService,
    private matDialog: MatDialog,
    private gv: GlobalValidatorService,
    private sendData: SentData,
    private api: UserAPIService,
    private router: Router,
    private API: PackageAPIService

  ) { }

  ngOnInit() {
    this.profileToUse.push({ formTemplateId: 0, formTemplateName: 'None' })
    this.getCriteriaSuccessMessage()
    this.getAddcriteriaData();
    this.formInitialize();
    this.getWEPCOrganizationList();
    this.isBulkAssign();
    this.getassessmentForm();
    this.getResultNotify();
    this.getAssessmentCodes();
    this.assessmentCodeTick = false;
    this.initializeCandidateInformatinView();
    this.stateList();
    this.districtList();
    this.collegeList();
    this.driveListsync();
    this.getSchedulepackageList()
    this.getdriveList();// getting campus drive list
    this.store.select(selectPackageDetailsState).subscribe((getPackageDetail: PackageDetailResponse) => {
      this.packageDetails = getPackageDetail.data;
    });
    this.patchStartDate = new Date();
    this.patchEndDate = new Date();
    sessionStorage.setItem('InstructionValue', '')

  }
  stateList() {
    this.api.stateSync({}).subscribe((data) => {
    })
  }
  districtList() {
    this.api.districtSync({}).subscribe((data) => {
    })
  }
  collegeList() {
    this.api.collegeSync({}).subscribe((data) => {
    })
  }
  driveListsync() {
    this.api.driveSync({}).subscribe((data) => {
    })
  }

  // getting packages list
  getSchedulepackageList() {
    this.options = [];
    this.filteredOptions1 = [];
    this.API.getpackagesList().subscribe((data: any) => {
      if (data.success) {
        data.data.forEach(element => {
          this.options.push(element)
        });
        this.filteredOptions1 = this.options;
      } else {
        this.sendData.warning('Please try some time')
      }
    })
  }

  addDisplayInstructions() {
    sessionStorage.setItem('InstructionValue', '')
    this.getInstructiondata();
    this.matDialog.open(InstructionScheduleComponent, {
      width: '60%',
      height: '100%',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      position: { right: '0' }
    })
  }


  getInstructiondata() {
    this.sendData.getMessage().subscribe((data) => {
      if (data.event == "instrution") {
        this.isBtnDisbaled = data.isBtnDisbaled;
        this.getInstructionvalue = data.addhtmlValue ? data.addhtmlValue : sessionStorage.getItem('InstructionValue');
      }

    })
  }

  addDisplayInstructionsvisible() {
    this.isBtnDisbaled = this.isBtnDisbaled
    let getInstructions = sessionStorage.getItem('InstructionValue')
    let data = {
      isBtnDisbaled: this.isBtnDisbaled,
      getInstructionvalue: getInstructions,
      editButton: true,
      event: 'instrution',
    }
    this.matDialog.open(InstructionScheduleComponent, {
      width: '60%',
      height: '100%',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      position: { right: '0' },

    })
    this.sendData.sendMessage(data)
  }

  getAddcriteriaData() {
    this.sendData.getMessage().subscribe((data) => {
      if (data.event == 'critiria') {
        if (data && data.criteriaFormValue) {
          this.schedulePackageForm.value.testDetails[data.index].criteriaDet.push(data.criteriaFormValue);
        }
      }
    })
  }


  formInitialize() {
    this.schedulePackageForm = this.fb.group({
      scheduleName: [null, [Validators.required, this.gv.schedulepattern()]],
      formTemplateId: [0, [Validators.required]],
      campusDrivename: [0, [Validators.required]],
      chooseTemplatename: [1, [Validators.required]],
      scheduleDescription: [null, [Validators.required, this.gv.schedulepattern()]],
      assessmentcode: [{ value: '', disabled: true }, Validators.required],
      scheduleDate: [new Date(), [Validators.required]],
      // schedul end Date and time
      scheduleEndDate: [new Date(), [Validators.required]],
      publishDate: [new Date()],
      assessmentName: [null, [Validators.required]],
      orgId: [null, [Validators.required]],
      templateId: [null, [Validators.required]],
      is_proctor: ['1', [Validators.required]],
      is_published: ['0', [Validators.required]],
      displaygeneral: ['0', [Validators.required]],
      driveId: [{ value: '', disabled: true }],
      assessmentFlow: [null, [Validators.required]],
      feedback: [0],
      testDetails: this.fb.array([]),
      // attemptRestrict: ['0', [Validators.required]],
      // numberOfattempt: [null, [this.gv.twoDigit()]],
      // activityTimeRestrict: ['0', [Validators.required]],
      // activityTimeDuration: [null, [this.gv.twoDigit()]],
      // browserTolerance: [0, [Validators.required, this.gv.numberOnly(), this.gv.twoDigit()]],
      // idealTimeCapture: [0, [Validators.required, this.gv.numberOnly(), this.gv.twoDigit()]],
      // idealTimePopupDuration: [0, [Validators.required, this.gv.numberOnly(), this.gv.threeDigit()]],
      resultNotifySuccess: ['0', [Validators.required]],
      resultNotifySuccessTemplate: [null],
      resultNotifyFailure: ['0', [Validators.required]],
      resultNotifyFailureTemplate: [null]
    });
  }

  onDateChanged(result: Date, endDate): void {
    this.patchStartDate = result
    if (endDate != undefined && endDate != null) {
      this.checkStartDateAndTime(endDate, result)
    } else {
      this.sendData.warning('Please select schedule ends on');
    }
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };

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


  // range(start: number, end: number): number[] {
  //   const result: number[] = [];
  //   for (let i = start; i < end; i++) {
  //     result.push(i);
  //   }
  //   return result;
  // }


  // disabledDateTime: DisabledTimeFn = () => {
  //   this.currentTime = new Date()
  //   let selectedTime =  new Date(this.TimeValidationCheckForSequential)
  //   const dateIsAfter = moment(selectedTime).isAfter(moment(this.currentTime),'days');
  //   let hours = this.currentTime.getHours();
  //   let minutes = this.currentTime.getMinutes();
  //   console.log(dateIsAfter,'dateIsAfter')
  //   if(dateIsAfter == false){
  //     return {
  //       nzDisabledHours: () => this.range(0, 24).splice(0, hours),
  //       nzDisabledMinutes: () => this.range(0, 60).splice(0, minutes),
  //       nzDisabledSeconds: () => []
  //       } 
  //   }else{
  //     return {
  //       nzDisabledHours: () => [],
  //       nzDisabledMinutes: () => [],
  //       nzDisabledSeconds: () => []
  //       } 
  //   }

  // }

  onOkStartDate(event) {
    this.patchStartDate = event
  }

  checkStartDateAndTime(endDate, startDate) {
    if (this.schedulePackageForm.controls.assessmentFlow.value == 'parallel') {
      endDate = new Date(endDate)
      const dateIsAfter = moment(endDate).isAfter(moment(startDate));
      if (dateIsAfter) {
      } else {
        setTimeout(() => {
          if (this.schedulePackageForm.controls.assessmentName.value) {

            this.sendData.warning('Start date should be lesser than end date');
          }
        }, 10);

      }
    }
  }

  onEndDateChanged(event: Date, startDate): void {
    this.patchEndDate = event;
    if (startDate != undefined && startDate != null) {
      this.checkEndDateAndTime(startDate, event)
    } else {
      this.sendData.warning('Please select schedule starts on');
    }
  }

  onOkEndDate(event) {
    this.patchEndDate = event;
  }

  checkEndDateAndTime(startDate, EndDate) {
    if (this.schedulePackageForm.controls.assessmentFlow.value == 'parallel') {
      startDate = new Date(startDate).toISOString();
      const dateIsBefore = moment(startDate).isBefore(moment(EndDate));
      if (dateIsBefore) {
      } else {
        setTimeout(() => {
          if (this.schedulePackageForm.controls.assessmentName.value) {
            this.sendData.warning('End date should be greater than start date and test durations');
          }
        }, 10)
      }
    }

  }

  onPublishTimeChanged(time: any) {
    this.schedulePackageForm.patchValue({ publishTime: time });
  }

  onpublishDateChanged(event: Date): void {
    const publishDate = new Date(event).toISOString();
    this.schedulePackageForm.patchValue({ publishDate: publishDate });
  }

  getOptionSelectedData(event, selectedPackage: AssesmentPackagesModel): void {
    if (event.isUserInput == true) {
      this.patchSequentialForm(selectedPackage && selectedPackage.attributes && selectedPackage.attributes.tasks)

      this.store.dispatch(
        ScheduleActions.initGetPackageDetails({
          payload: {
            packageId: selectedPackage.id.toString(),
            orgId: this.schedulePackageForm.get('orgId')?.value
          }
        })
      );
      this.isAssessmentDetailsShow = true;
    }
  }

  resetPackageDetails(): void {
    this.resetingForm()
    this.packageDetails = {
      id: 0,
      type: '',
      attributes: {
        name: '',
        description: '',
        status: '',
        type: '',
        level: '',
        duration: 0,
        usageCount: 0,
        updatedBy: '',
        updatedTime: '',
        tasks: []
      }
    };

  }

  //*************************** Upload Excel Validation functionality ***************************
  createCandidateInformation(): FormGroup {
    return this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required]
    });
  }

  parseCsvFile(csvFile: File, event): void {
    this.validFile = false;
    this.csvRows = [];
    if (csvFile.type == "text/csv") {
      var extension = csvFile.name.split('.').pop().toLowerCase(),
        isSuccess = ['csv'].indexOf(extension) > -1;
      if (isSuccess) {
        const file: File = csvFile;
        const reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          const csv: any = reader.result;
          let allTextLines = [];
          allTextLines = csv.split(/\r|\n|\r/);
          const arrayLength = allTextLines.length;
          let rows: any[] = [];
          if (this.schedulePackageForm.get('chooseTemplatename').value == 1) {
            let validateHeader = allTextLines[0].split(';')[0].split(',');
            if (validateHeader && validateHeader.length == 3
              && validateHeader[0] == 'emailId'
              && validateHeader[1] == 'name'
              && validateHeader[2] == 'instanceId') {

              this.checkDefaultCandidateBulkUpload(rows, arrayLength, allTextLines)


            } else {
              this.validFile = true;
              // this.showCsvFileInformation = false;
            }

          } else {
            // ********** Bajal Looping for header Checking **************//
            let validateHeader = allTextLines[0].split(';')[0].split(',');
            if (validateHeader && validateHeader.length == 20 &&
              validateHeader[0] == 'emailId'
              && validateHeader[1] == 'name'
              && validateHeader[2] == 'instanceId'
              && validateHeader[3] == 'gender'
              && validateHeader[4] == 'alternateEmailId'
              && validateHeader[5] == 'degree'
              && validateHeader[6] == 'specialization'
              && validateHeader[7] == 'SSLC'
              && validateHeader[8] == 'yearOfPassingSSLC'
              && validateHeader[9] == 'HSC'
              && validateHeader[10] == 'yearOfPassingHSC'
              && validateHeader[11] == 'UG'
              && validateHeader[12] == 'yearOfPassingUG'
              && validateHeader[13] == 'PG'
              && validateHeader[14] == 'yearOfPassingPG'
              && validateHeader[15] == 'PhD'
              && validateHeader[16] == 'yearOfPassingPhD'
              && validateHeader[17] == 'backlogActiveandDead'
              && validateHeader[18] == 'diplomaBeforeBEorBTech'
              && validateHeader[19] == 'internAtBALorCTL'
            ) {

              this.checkBajajCandidateBulkUpload(rows, arrayLength, allTextLines)



            } else {
              this.validFile = true;
            }
          }
        }
      } else {
        this.dialogContent = false;
      }
    } else {
      this.toaster.warning("Accept only .csv files")

    }
  }
  checkDefaultCandidateBulkUpload(rows, arrayLength, allTextLines) {
    for (let i = 1; i < arrayLength - 1; i++) {
      const rowData = allTextLines[i].split(';')[0].split(',');
      if (rowData.length > 1 && rowData[0]) {
        rows.push({
          emailId: rowData[0] ? rowData[0].trim() : '',
          instanceId: rowData[2] ? rowData[2].trim() : '',
          name: rowData[1] ? rowData[1].trim() : '',
        });
      }
    }

    if (rows.length > 0) {
      this.uploadPush = rows;
      this.csvRows.push(rows);
      // Check for valid emails, update if valid,invalid email exists
      rows.forEach((candidateInfo: any) => {
        this.disableCreateButton = this.validEmailsList.length ? false : true;
      });
      this.findAndUpdateDuplicateEmailsList(rows);
      if (rows.length &&
        this.invalidEmailsList.length == 0
        && this.invalidInstanceIdList.length == 0
        && this.invalidFirstname.length == 0
      ) {
        this.candidateExcelValidationFromBackend()
      } else {
        this.excelvalue = [];
        this.dialogContent = false;
        this.showError = true;
        this.showBajajError = false;
        this.disableCreateButton = true;
        this.matDialog.closeAll();
      }
    } else {
      this.toaster.warning("Please upload file with data");
    }

  }

  checkBajajCandidateBulkUpload(rows, arrayLength, allTextLines) {
    for (let i = 1; i < arrayLength - 1; i++) {
      const rowData = allTextLines[i].split(';')[0].split(',');
      if (rowData.length > 1 && rowData[0]) {
        rows.push({
          emailId: rowData[0] ? rowData[0].trim() : '',
          name: rowData[1] ? rowData[1].trim() : '',
          instanceId: rowData[2] ? rowData[2].trim() : '',
          gender: rowData[3] ? rowData[3].trim() : '',
          alternateEmailId: rowData[4] ? rowData[4].trim() : '',
          degree: rowData[5] ? rowData[5].trim() : '',
          specialization: rowData[6] ? rowData[6].trim() : '',
          SSLC: rowData[7] ? rowData[7].trim() : '',
          yearOfPassingSSLC: rowData[8] ? rowData[8].trim() : '',
          HSC: rowData[9] ? rowData[9].trim() : '',
          yearOfPassingHSC: rowData[10] ? rowData[10].trim() : '',
          UG: rowData[11] ? rowData[11].trim() : '',
          yearOfPassingUG: rowData[12] ? rowData[12].trim() : '',
          PG: rowData[13] ? rowData[13].trim() : '',
          yearOfPassingPG: rowData[14] ? rowData[14].trim() : '',
          PhD: rowData[15] ? rowData[15].trim() : '',
          yearOfPassingPhD: rowData[16] ? rowData[16].trim() : '',
          backlogActiveandDead: rowData[17] ? rowData[17].trim() : '',
          diplomaBeforeBEorBTech: rowData[18] ? rowData[18].trim() : '',
          internAtBALorCTL: rowData[19] ? rowData[19].trim() : '',
        });
      }
    }


    if (rows.length > 0) {
      this.uploadbajaj = rows;
      this.csvRows.push(rows);
      // Check for valid emails, update if valid,invalid email exists
      rows.forEach((candidateInfo: any) => {
        // this.validateEmailAndUpdateValidInvalidEmailList(candidateInfo);
        // this.validateInstanceIdAndUpdateValidInvalidInstanceId(candidateInfo);
        // this.fisrtNameAndUpdateValidInvalidFirstname(candidateInfo);
        // this.gendervalidation(candidateInfo);
        // this.degreevalidation(candidateInfo);
        // this.Specialization(candidateInfo);
        // this.tenthvalidation(candidateInfo);
        // this.yearofpassingtenth(candidateInfo);
        // this.twelfthvalidation(candidateInfo);
        // this.yearofpassingtwelfth(candidateInfo);
        // this.Backlogvalidation(candidateInfo);
        // this.Diplomavalidation(candidateInfo);
        // this.internvalidation(candidateInfo);
        this.disableCreateButton = this.validEmailsList.length ? false : true;
      });
      this.findAndUpdateDuplicateEmailsList(rows);

      if (rows.length && this.invalidEmailsList.length == 0 && this.invalidInstanceIdList.length == 0 && this.invalidFirstname.length == 0
        && this.invalidgender.length == 0 && this.invalidDegree.length == 0 && this.invalidSpecialization.length == 0 && this.invalidtenthvalidation.length == 0
        && this.invalidtwelfthvalidation.length == 0 && this.invalidBacklogvalidation.length == 0 && this.invalidDiplomavalidation.length == 0 && this.invalidinternvalidation.length == 0) {

        this.candidateExcelValidationFromBackend()
      } else {
        this.checkEmptyFile = true;
        this.dialogContent = false;
        this.showBajajError = true;
        this.showError = false;
        this.disableCreateButton = true;
        this.matDialog.closeAll();
      }
    }
    else {
      this.toaster.warning("Please upload file with data");
    }
  }
  fileDropped(files: NgxFileDropEntry[]): void {
    this.files = files;
    this.selectedCSVFile = null;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.selectedCSVFile = file;
          this.switchToAddEmailView = false;
          this.showCsvFileInformation = true;
          this.isSuccess = true;
          this.csvFileName = file.name;
        });
      } else {

      }
    }
  }
  candidateExcelValidationFromBackend() {
    let checkisTao: any = this.findIsTao(this.packageDetails && this.packageDetails.attributes && this.packageDetails.attributes.tasks)
    const fd = new FormData();
    fd.append('uploadCandidateFile', this.selectedCSVFile),
      fd.append('excelTemplateId', this.selectedTemplate),
      fd.append('isTao', checkisTao)
    this.scheduleService.candidateBulkSchedule(fd).subscribe((response: any) => {
      if (response.success) {
        this.candidateUrl = response.candidateUrl;
        this.dialogContent = true;
        this.uploadnamechange = true;
        this.disableCreateButton = false;
        this.showBajajError = false;
        this.showError = false;
      } else {
        this.excelvalue = response.message;
        if (response.message == "Instance id fields should not be empty") {
          this.toaster.warning(response.message)
        }
        this.dialogContent = false;
        this.matDialog.closeAll();
        this.disableCreateButton = true;
        this.showError = false;
        this.checkinstance = response.message[0].status == "Invalid" || response.message[0].status == "InActive";
        if (this.selectedTemplate == 1) {
          this.showError = true;
          this.showBajajError = false;
          this.uploadnamechange = !this.uploadnamechange;
        } else {
          this.showError = false;
          this.showBajajError = true;
          this.uploadnamechange = !this.uploadnamechange;
        }
        this.disableCreateButton = true;
      }
    })
  }
  onCsvButtonClick(): void {
    this.toogleAddCandidateInfoButton = false;
    this.switchToAddEmailView = true;
  }

  exitUploadMode(): void {
    this.toogleAddCandidateInfoButton = true;
    this.switchToAddEmailView = false;
  }

  deleteCsvFile(): void {
    if (this.showCsvFileInformation == true) {
      this.candidateUrl = '';
      this.validFile = false;
      this.csvRows = [];
      this.uploadFileShow = false;
      this.csvFileName = '';
      this.showCsvFileInformation = false;
      this.toogleAddCandidateInfoButton = true;
      this.invalidEmailsList = [];
      this.validEmailsList = [];
      this.invalidInstanceIdList = [];
      this.validInstanceIdList = [];
      this.firstNameerror = [];
      this.invalidFirstname = [];
      this.duplicateEmailsListCount = 0;
      this.uploadnamechange = false;

      // Bajal Deleted keys //
      this.validgender = [];
      this.invalidgender = [];
      this.validDegree = [];
      this.invalidDegree = [];
      this.validSpecialization = [];
      this.invalidSpecialization = [];
      this.validtenthvalidation = [];
      this.invalidtenthvalidation = [];
      this.validyearofpassingtenth = [];
      this.invalidyearofpassingtenth = [];
      this.validtwelfthvalidation = [];
      this.invalidtwelfthvalidation = [];
      this.validyearofpassingtwelfth = [];
      this.invalidyearofpassingtwelfth = [];
      this.validBacklogvalidation = [];
      this.invalidBacklogvalidation = [];
      this.validDiplomavalidation = [];
      this.invalidDiplomavalidation = [];
      this.validinternvalidation = [];
      this.invalidinternvalidation = [];
      this.disableCreateButton = true;
    }
    else {
      this.matDialog.closeAll();
    }

  }

  initializeCandidateInformatinView(): void {
    this.switchToAddEmailView = false;
    this.toogleUploadCsvButton = false;
    this.toogleAddCandidateInfoButton = true;
    this.showCsvFileInformation = false;
  }

  findAndUpdateDuplicateEmailsList(totalRows: any[]): void {
    const uniqueEmails = [...new Set(totalRows.map((item: any) => item.emailId))];
    this.duplicateEmailsListCount = totalRows.length - uniqueEmails.length;
  }


  checkcriteriaValidation() {
    let criteriaarr: any = [];
    let formArrayvalue = [];
    if (this.schedulePackageForm && this.schedulePackageForm.controls && this.schedulePackageForm.controls.testDetails) {
      formArrayvalue = this.schedulePackageForm.controls.testDetails.value;
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
  createSchedulePackage() {
    this.checkcriteriaValidation()
    let formValues = this.schedulePackageForm.getRawValue();
    if (this.schedulePackageForm.valid) {
      if (formValues.assessmentFlow == 'sequential' && this.checkcriteriaValidation() == true && formValues.is_proctor == '0') {
        this.sendData.warning('If you select proctor score in add criteria please select Yes in proctor check');
      } else {
        if (formValues.assessmentFlow == 'sequential' && this.testTimeCheck == true) {
          this.sendData.warning('Please click on check');
        } else {
          if (this.schedulePackageForm.get('displaygeneral')?.value == '0') {
            this.createScheduleFromEdgeService();
          } else {
            if (this.schedulePackageForm.get('displaygeneral')?.value == '1' && this.getInstructionvalue != undefined) {
              this.createScheduleFromEdgeService();
            } else {
              this.sendData.warning('Please fill the instructions');
            }
          }
        }
      }
    } else {
      this.sendData.warning('Please fill the required fields');
    }

  }
  orgChange(event) {
    if (event) {
      this.orginfo = event;
      this.showProctorTemplate = true;
      this.isSendNotificationEnable = false;
      this.getProctorTemplate(this.orginfo.id ? this.orginfo.id : this.orginfo.orgId);
      this.getProfileFormToUse(this.orginfo.id ? this.orginfo.id : this.orginfo.orgId)
    } else {
      this.showProctorTemplate = false;
      this.isSendNotificationEnable = true;
    }
  }


  findIsTao(testDetails) {
    const result = testDetails.find(({ type }) => type === "Personality and Behaviour" || type === "Aptitude");
    return result ? 1 : 0;
  }


  createScheduleFromEdgeService() {
    let data;
    let formValues = this.schedulePackageForm.getRawValue();
    if (formValues.assessmentFlow == 'parallel') {
      data = {
        scheduleName: formValues.scheduleName,
        description: formValues.scheduleDescription,
        assessmentPackName: formValues.assessmentName,
        startDateTime: formValues.scheduleDate,
        endDateTime: formValues.scheduleEndDate,
        isPublish: formValues.is_published,
        publishDate: formValues.publishDate ? formValues.publishDate : null,
        isProctor: formValues.is_proctor,
        duration: this.packageDetails.attributes.duration,
        orgId: this.orginfo.id ? this.orginfo.id : this.orginfo.orgId,
        org: this.orginfo.name ? this.orginfo.name : this.orginfo.orgName,
        supportEmail: this.orginfo ? this.orginfo.supportEmail : '',
        supportPhone: this.orginfo ? this.orginfo.supportPhone : '',
        campusDriveName: formValues.campusDrivename,
        campusDriveId: formValues.driveId,
        assessmentFlow: formValues.assessmentFlow,
        formTemplateId: formValues.formTemplateId,
        proctorTemplateName: formValues.is_proctor == '1' ? formValues.templateId : '',
        packageTemplateId: this.packageDetails.id,
        candidateUrl: this.candidateUrl,
        assessmentCode: formValues.assessmentcode,
        chooseTemplatename: formValues.chooseTemplatename,
        testDetails: this.packageDetails.attributes.tasks,
        instructionHtml: this.getInstructionvalue,
        instructionFlag: formValues.displaygeneral,
        isCampusSchedule: formValues.driveId ? '1' : '0',
        isTao: this.findIsTao(this.packageDetails.attributes.tasks),
        feedbackFormId: formValues.feedback,
        // attemptRestrict: formValues.attemptRestrict,
        // numberOfattempt: parseInt(formValues.numberOfattempt),
        // activityTimeRestrict: formValues.activityTimeRestrict,
        // activityTimeDuration: parseInt(formValues.activityTimeDuration),
        // browserTolerance: parseInt(formValues.browserTolerance),
        // idealTimeCapture: parseInt(formValues.idealTimeCapture),
        // idealTimePopupDuration: parseInt(formValues.idealTimePopupDuration)

      }
    } else {
      data = {
        scheduleName: formValues.scheduleName,
        description: formValues.scheduleDescription,
        assessmentPackName: formValues.assessmentName,
        startDateTime: formValues.scheduleDate,
        endDateTime: formValues.scheduleEndDate,
        isPublish: formValues.is_published,
        publishDate: formValues.publishDate ? formValues.publishDate : null,
        isProctor: formValues.is_proctor,
        duration: this.packageDetails.attributes.duration,
        orgId: this.orginfo.id ? this.orginfo.id : this.orginfo.orgId,
        org: this.orginfo.name ? this.orginfo.name : this.orginfo.orgName,
        supportEmail: this.orginfo ? this.orginfo.supportEmail : '',
        supportPhone: this.orginfo ? this.orginfo.supportPhone : '',
        campusDriveName: formValues.campusDrivename,
        campusDriveId: formValues.driveId,
        assessmentFlow: formValues.assessmentFlow,
        formTemplateId: formValues.formTemplateId,
        proctorTemplateName: formValues.is_proctor == '1' ? formValues.templateId : '',
        packageTemplateId: this.packageDetails.id,
        candidateUrl: this.candidateUrl,
        assessmentCode: formValues.assessmentcode,
        chooseTemplatename: formValues.chooseTemplatename,
        testDetails: this.schedulePackageForm.value.testDetails,
        instructionHtml: this.getInstructionvalue,
        instructionFlag: formValues.displaygeneral,
        isCampusSchedule: formValues.driveId ? '1' : '0',
        isTao: this.findIsTao(formValues.testDetails),
        feedbackFormId: formValues.feedback,
        // attemptRestrict: formValues.attemptRestrict,
        // numberOfattempt: parseInt(formValues.numberOfattempt),
        // activityTimeRestrict: formValues.activityTimeRestrict,
        // activityTimeDuration: parseInt(formValues.activityTimeDuration),
        // browserTolerance: parseInt(formValues.browserTolerance),
        // idealTimeCapture: parseInt(formValues.idealTimeCapture),
        // idealTimePopupDuration: parseInt(formValues.idealTimePopupDuration),
        resultNotifySuccess: parseInt(formValues.resultNotifySuccess),
        resultNotifySuccessTemplate: formValues.resultNotifySuccessTemplate,
        resultNotifyFailure: parseInt(formValues.resultNotifyFailure),
        resultNotifyFailureTemplate: formValues.resultNotifyFailureTemplate,
      }
    }
    this.scheduleService.uapSchedules(data).subscribe((response: any) => {
      if (response.success) {
        sessionStorage.removeItem('InstructionValue');
        this.sendData.success("Schedule creation request has been recorded, Sync process will start shortly as per queued order");
        this.router.navigate(['/admin/schedule/list']);
      } else {
        this.sendData.error(response.message);
      }
    });
  }

  // filtering based on email
  getUniqueCandidateInformation(): any[] {
    const uniqueCandidateInformation = new Map<string, any>();
    this.validEmailsList.forEach((candidateInfo: any) => {
      if (!uniqueCandidateInformation.get(candidateInfo.emailId)) {
        uniqueCandidateInformation.set(candidateInfo.emailId, candidateInfo);
      }
    });
    return Array.from(uniqueCandidateInformation.values());
  }

  ngOnDestroy(): void {
    this.initializeCandidateInformatinView();
  }

  onSearchChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (value) {
      this.getpackagesListsearchValue(value)
    } else {
      this.getpackagesListsearchValue('')
      this.resetPackageDetails();
      this.isAssessmentDetailsShow = false;
    }
  }


  getpackagesListsearchValue(val) {
    this.API.getSearchpackagesList(val).subscribe((data: any) => {
      if (data.success) {
        this.options = [];
        data.data.forEach(element => {
          this.options.push(element)
        });
        this.filteredOptions1 = this.options;
      } else {
        this.sendData.warning(data.message);
        this.filteredOptions1 = []
      }
    })
  }

  validateFormField(formField: string): boolean {
    const scheduleField = this.schedulePackageForm.get(formField);
    if (scheduleField?.invalid && scheduleField?.touched) {
      return true;
    } else {
      return false;
    }
  }

  getWEPCOrganizationList() {
    const roleCode = this.sendData.getUserRoleCode();
    if (roleCode != 'OADM') {
      this.scheduleService.getWEPCOrganization({}).subscribe((response: any) => {
        if (response.success) {
          this.listOfOrg = response.data;
        } else {
          this.sendData.warning('Please Try again...');
        }
      });
    } else {
      const orgList = this.sendData.getUserPermission();
      this.listOfOrg = orgList && orgList.organisations;
    }
  }

  openSendNotification() {
    let formValues = this.schedulePackageForm.getRawValue();
    let data = {
      username: 'Candidate',
      useremail: this.orginfo ? this.orginfo.supportEmail : '',
      orgName: this.orginfo.name ? this.orginfo.name : this.orginfo.orgName,
      getEmail: true,
      supportEmail: this.orginfo ? this.orginfo.supportEmail : '',
      supportPhone: this.orginfo ? this.orginfo.supportPhone : '',
      testDetails: this.schedulePackageForm.get('assessmentFlow').value == 'parallel' ? this.packageDetails.attributes.tasks : this.schedulePackageForm.value.testDetails,
      startDateTime: formValues.scheduleDate,
      endDateTime: formValues.scheduleEndDate,
      assessmentFlow: this.schedulePackageForm.get('assessmentFlow').value
    };
    this.scheduleService.sendNotifications(data).subscribe((response: any) => {
      if (response.success) {
        this.bufferData = response.data.data;
        this.emailtemplate = Buffer.from(this.bufferData).toString();
      } else {
        this.sendData.warning('Please Try again...');
      }
    });
  }

  openNoticationTemplate() {
    if (this.schedulePackageForm.get('orgId')?.value) {
      this.notificationsdialogRef = this.matDialog.open(this.notifications, {
        width: '908px',
        height: 'auto',
        panelClass: 'loginpopover',
        autoFocus: false,
        closeOnNavigation: true,
        disableClose: true
      });
      this.openSendNotification();
    } else {
      this.sendData.warning('Please select organisation');
    }
  }

  openUploadDialog() {
    this.notificationsdialogRef = this.matDialog.open(this.uploadfiles, {
      width: '675px',
      height: '411px',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
    });
    this.showError = false;
    this.showBajajError = false;
    this.instaidCheck = 'excelFrontcheck';
    this.dialogContent = null;
    this.csvRows = [];
    this.uploadFileShow = false;
    this.csvFileName = '';
    this.showCsvFileInformation = false;
    this.toogleAddCandidateInfoButton = true;
    this.invalidEmailsList = [];
    this.validEmailsList = [];
    this.invalidInstanceIdList = [];
    this.validInstanceIdList = [];
    this.firstNameerror = [];
    this.invalidFirstname = [];
    this.duplicateEmailsListCount = 0;

    // Bajal Success close //
    this.validgender = [];
    this.invalidgender = [];
    this.validDegree = [];
    this.invalidDegree = [];
    this.validSpecialization = [];
    this.invalidSpecialization = [];
    this.validtenthvalidation = [];
    this.invalidtenthvalidation = [];
    this.validyearofpassingtenth = [];
    this.invalidyearofpassingtenth = [];
    this.validtwelfthvalidation = [];
    this.invalidtwelfthvalidation = [];
    this.validyearofpassingtwelfth = [];
    this.invalidyearofpassingtwelfth = [];
    this.validBacklogvalidation = [];
    this.invalidBacklogvalidation = [];
    this.validDiplomavalidation = [];
    this.invalidDiplomavalidation = [];
    this.validinternvalidation = [];
    this.invalidinternvalidation = [];
  }
  reupload() {
    this.notificationsdialogRef = this.matDialog.open(this.uploadfiles, {
      width: '675px',
      height: '411px',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
    });
    this.showBajajError = false;
    this.showError = false;
    this.dialogContent = null;
    this.csvRows = [];
    this.uploadFileShow = false;
    this.csvFileName = '';
    this.showCsvFileInformation = false;
    this.toogleAddCandidateInfoButton = true;
    this.invalidEmailsList = [];
    this.validEmailsList = [];
    this.invalidInstanceIdList = [];
    this.validInstanceIdList = [];
    this.firstNameerror = [];
    this.invalidFirstname = [];
    this.duplicateEmailsListCount = 0;

    this.validgender = [];
    this.invalidgender = [];
    this.validDegree = [];
    this.invalidDegree = [];
    this.validSpecialization = [];
    this.invalidSpecialization = [];
    this.validtenthvalidation = [];
    this.invalidtenthvalidation = [];
    this.validyearofpassingtenth = [];
    this.invalidyearofpassingtenth = [];
    this.validtwelfthvalidation = [];
    this.invalidtwelfthvalidation = [];
    this.validyearofpassingtwelfth = [];
    this.invalidyearofpassingtwelfth = [];
    this.validBacklogvalidation = [];
    this.invalidBacklogvalidation = [];
    this.validDiplomavalidation = [];
    this.invalidDiplomavalidation = [];
    this.validinternvalidation = [];
    this.invalidinternvalidation = [];
    this.matDialog.closeAll();
  }

  getProctorTemplate(orgId) {
    this.proctorTemplateList = [];
    this.scheduleService.getProctorTemplateName(orgId).subscribe((response: any) => {
      if (response.success) {
        this.proctorTemplateList = response.data;
        this.schedulePackageForm.get('templateId').setValue(response.data ? response.data[0].tempname : '');
      } else {
        this.schedulePackageForm.get('templateId').setValue(null);
        this.sendData.warning(response.message);
      }
    });
  }

  selectTemplate(templateDetails) {
    this.selectedTemplateName = templateDetails?.tempname;
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


  getAssessmentCodes() {
    this.scheduleService.getAssessmentCode().subscribe((response: any) => {
      if (response.success) {
        this.schedulePackageForm.patchValue({ assessmentcode: response.assessmentCode });
      } else {
        this.sendData.warning(response.message);
      }
    });
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
  tableclose() {
    this.uploadnamechange = false;
    this.showError = false;
    this.showBajajError = false;
    this.excelvalue = [];
    this.dialogContent = !this.dialogContent
    this.csvRows = [];
    this.uploadFileShow = false;
    this.csvFileName = '';
    this.showCsvFileInformation = false;
    this.toogleAddCandidateInfoButton = true;
    this.invalidEmailsList = [];
    this.validEmailsList = [];
    this.invalidInstanceIdList = [];
    this.validInstanceIdList = [];
    this.firstNameerror = [];
    this.invalidFirstname = [];
    this.duplicateEmailsListCount = 0;


    // Bajal Success close //
    this.validgender = [];
    this.invalidgender = [];
    this.validDegree = [];
    this.invalidDegree = [];
    this.validSpecialization = [];
    this.invalidSpecialization = [];
    this.validtenthvalidation = [];
    this.invalidtenthvalidation = [];
    this.validyearofpassingtenth = [];
    this.invalidyearofpassingtenth = [];
    this.validtwelfthvalidation = [];
    this.invalidtwelfthvalidation = [];
    this.validyearofpassingtwelfth = [];
    this.invalidyearofpassingtwelfth = [];
    this.validBacklogvalidation = [];
    this.invalidBacklogvalidation = [];
    this.validDiplomavalidation = [];
    this.invalidDiplomavalidation = [];
    this.validinternvalidation = [];
    this.invalidinternvalidation = [];
    this.matDialog.closeAll();
  }

  successClose(type) {
    if (type == 'newFile') {
      this.uploadFileShow = true;
    } else {
      this.uploadFileShow = false;
    }
    this.showCsvFileInformation = false;
    this.toogleUploadCsvButton = false;
    this.toogleAddCandidateInfoButton = true;
    this.invalidEmailsList = [];
    this.validEmailsList = [];
    this.invalidInstanceIdList = [];
    this.validInstanceIdList = [];
    this.invalidFirstname = [];
    this.firstNameerror = [];
    this.duplicateEmailsListCount = 0;


    // Bajal Success close //
    this.validgender = [];
    this.invalidgender = [];
    this.validDegree = [];
    this.invalidDegree = [];
    this.validSpecialization = [];
    this.invalidSpecialization = [];
    this.validtenthvalidation = [];
    this.invalidtenthvalidation = [];
    this.validyearofpassingtenth = [];
    this.invalidyearofpassingtenth = [];
    this.validtwelfthvalidation = [];
    this.invalidtwelfthvalidation = [];
    this.validyearofpassingtwelfth = [];
    this.invalidyearofpassingtwelfth = [];
    this.validBacklogvalidation = [];
    this.invalidBacklogvalidation = [];
    this.validDiplomavalidation = [];
    this.invalidDiplomavalidation = [];
    this.validinternvalidation = [];
    this.invalidinternvalidation = [];
    this.matDialog.closeAll();
  }

  closePop(e: any) {
    this.matDialog.closeAll();
  }

  displayGeneral(event) {
    if (event.value == '1') {
      this.displaygeneralinstructionbutton = false
    } else if (event.value == '0') {
      this.displaygeneralinstructionbutton = true;
      sessionStorage.setItem('InstructionValue', '')
      this.isBtnDisbaled = false;
      this.getInstructionvalue = null;
    }
    else {
      this.displaygeneralinstructionbutton = true
    }
  }

  flowChange(event) {
    if (event.value == 'parallel') {
      this.flowchange = true;
      this.isAssessmentDetailsShow = false;
      this.showError = false;
      this.showBajajError = false;
      this.uploadFileShow = false;
      this.uploadnamechange = false;
      this.resetPackageDetails();
    } else {
      this.isAssessmentDetailsShow = false;
      this.showError = false;
      this.showBajajError = false;
      this.uploadFileShow = false;
      this.uploadnamechange = false;
      this.resetPackageDetails();
      this.flowchange = false;
    }
  }

  resetingForm() {
    this.schedulePackageForm.controls.scheduleDate.setValue(new Date())
    this.schedulePackageForm.controls.scheduleDate.markAsUntouched();
    this.schedulePackageForm.controls.scheduleDate.updateValueAndValidity({ emitEvent: false });

    this.schedulePackageForm.controls.scheduleEndDate.setValue(new Date())
    this.schedulePackageForm.controls.scheduleEndDate.markAsUntouched();
    this.schedulePackageForm.controls.scheduleEndDate.updateValueAndValidity({ emitEvent: false });

    this.schedulePackageForm.controls.assessmentName.setValue('');
    this.schedulePackageForm.controls.assessmentName.markAsUntouched();
    this.schedulePackageForm.controls.assessmentName.updateValueAndValidity({ emitEvent: false });

    this.schedulePackageForm.controls.feedback.setValue(0);
    this.schedulePackageForm.controls.feedback.markAsUntouched();
    this.schedulePackageForm.controls.feedback.updateValueAndValidity({ emitEvent: false });

    this.schedulePackageForm.controls.campusDrivename.setValue(0);
    this.schedulePackageForm.controls.campusDrivename.markAsUntouched();
    this.schedulePackageForm.controls.campusDrivename.updateValueAndValidity({ emitEvent: false });

    this.schedulePackageForm.controls.driveId.setValue(0);
    this.schedulePackageForm.controls.driveId.markAsUntouched();
    this.schedulePackageForm.controls.driveId.updateValueAndValidity({ emitEvent: false });

    this.schedulePackageForm.controls.chooseTemplatename.setValue(1);
    this.schedulePackageForm.controls.chooseTemplatename.markAsUntouched();
    this.schedulePackageForm.controls.chooseTemplatename.updateValueAndValidity({ emitEvent: false });

    this.schedulePackageForm.controls.is_published.setValue('0');
    this.schedulePackageForm.controls.is_published.markAsUntouched();
    this.schedulePackageForm.controls.is_published.updateValueAndValidity({ emitEvent: false });

    // this.schedulePackageForm.controls.attemptRestrict.setValue('0');
    // this.schedulePackageForm.controls.attemptRestrict.markAsUntouched();
    // this.schedulePackageForm.controls.attemptRestrict.updateValueAndValidity({ emitEvent: false });

    // this.schedulePackageForm.controls.activityTimeRestrict.setValue('0');
    // this.schedulePackageForm.controls.activityTimeRestrict.markAsUntouched();
    // this.schedulePackageForm.controls.activityTimeRestrict.updateValueAndValidity({ emitEvent: false });


    this.schedulePackageForm.controls.is_proctor.setValue('1');
    this.schedulePackageForm.controls.is_proctor.markAsUntouched();
    this.schedulePackageForm.controls.is_proctor.updateValueAndValidity({ emitEvent: false });


    // this.schedulePackageForm.controls.resultNotifySuccess.setValue('0');
    // this.schedulePackageForm.controls.resultNotifySuccess.markAsUntouched();
    // this.schedulePackageForm.controls.resultNotifySuccess.updateValueAndValidity({ emitEvent: false });

    this.schedulePackageForm.controls.resultNotifyFailure.setValue('0');
    this.schedulePackageForm.controls.resultNotifyFailure.markAsUntouched();
    this.schedulePackageForm.controls.resultNotifyFailure.updateValueAndValidity({ emitEvent: false });

  }

  // Checking proctor Yes or No for Validation
  proctorcheck(event) {
    if (event.value == '1') {
      this.schedulePackageForm.controls.templateId.setValidators([Validators.required]);
      this.schedulePackageForm.controls.templateId.markAsTouched();
      this.schedulePackageForm.controls.templateId.updateValueAndValidity();
    } else if (event.value == '0') {
      this.schedulePackageForm.controls.templateId.clearValidators();
      this.schedulePackageForm.controls.templateId.setValidators(null);
      this.schedulePackageForm.controls.templateId.markAsUntouched();
      this.schedulePackageForm.controls.templateId.updateValueAndValidity();
    }
    else {
      this.schedulePackageForm.controls.templateId.clearValidators();
      this.schedulePackageForm.controls.templateId.setValidators(null);
      this.schedulePackageForm.controls.templateId.markAsUntouched();
      this.schedulePackageForm.controls.templateId.updateValueAndValidity();
    }
  }

  publistResult(event) {
    if (event.value == '1') {
      this.schedulePackageForm.controls.publishDate.setValidators([Validators.required]);
      this.schedulePackageForm.controls.publishDate.markAsTouched();
      this.schedulePackageForm.controls.publishDate.updateValueAndValidity();
    } else if (event.value == '0') {
      this.schedulePackageForm.controls.publishDate.clearValidators();
      this.schedulePackageForm.controls.publishDate.setValidators(null);
      this.schedulePackageForm.controls.publishDate.markAsUntouched();
      this.schedulePackageForm.controls.publishDate.updateValueAndValidity();
    }
    else {
      this.schedulePackageForm.controls.publishDate.clearValidators();
      this.schedulePackageForm.controls.publishDate.setValidators(null);
      this.schedulePackageForm.controls.publishDate.markAsUntouched();
      this.schedulePackageForm.controls.publishDate.updateValueAndValidity();
    }
  }


  // attempt(event) {
  //   if (event.value == '1') {
  //     this.schedulePackageForm.controls.numberOfattempt.setValidators([Validators.required, this.gv.twoDigit(), this.gv.numberOnly(),]);
  //     this.schedulePackageForm.controls.numberOfattempt.updateValueAndValidity();
  //   } else if (event.value == '0') {
  //     this.schedulePackageForm.controls.numberOfattempt.clearValidators();
  //     this.schedulePackageForm.controls.numberOfattempt.setValidators(null);
  //     this.schedulePackageForm.controls.numberOfattempt.setValue(null);
  //     this.schedulePackageForm.controls.numberOfattempt.markAsUntouched();
  //     this.schedulePackageForm.controls.numberOfattempt.updateValueAndValidity();
  //   }
  //   else {
  //     this.schedulePackageForm.controls.numberOfattempt.clearValidators();
  //     this.schedulePackageForm.controls.numberOfattempt.setValidators(null);
  //     this.schedulePackageForm.controls.numberOfattempt.markAsUntouched();
  //     this.schedulePackageForm.controls.numberOfattempt.updateValueAndValidity();
  //   }
  // }


  resultSuccess(event) {
    if (event.value == '1') {
      this.schedulePackageForm.controls.resultNotifySuccessTemplate.setValidators([Validators.required]);
      this.schedulePackageForm.controls.resultNotifySuccessTemplate.updateValueAndValidity();
    } else if (event.value == '0') {
      this.schedulePackageForm.controls.resultNotifySuccessTemplate.clearValidators();
      this.schedulePackageForm.controls.resultNotifySuccessTemplate.setValidators(null);
      this.schedulePackageForm.controls.resultNotifySuccessTemplate.setValue(null);
      this.schedulePackageForm.controls.resultNotifySuccessTemplate.markAsUntouched();
      this.schedulePackageForm.controls.resultNotifySuccessTemplate.updateValueAndValidity();
    }
    else {
      this.schedulePackageForm.controls.resultNotifySuccessTemplate.clearValidators();
      this.schedulePackageForm.controls.resultNotifySuccessTemplate.setValidators(null);
      this.schedulePackageForm.controls.resultNotifySuccessTemplate.markAsUntouched();
      this.schedulePackageForm.controls.resultNotifySuccessTemplate.updateValueAndValidity();
    }
  }

  resultFailure(event) {
    if (event.value == '1') {
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.setValidators([Validators.required]);
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.updateValueAndValidity();
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.setValue(null);
    } else if (event.value == '0') {
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.clearValidators();
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.setValidators(null);
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.setValue(null);
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.markAsUntouched();
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.updateValueAndValidity();
    }
    else {
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.clearValidators();
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.setValidators(null);
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.markAsUntouched();
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.updateValueAndValidity();
    }
  }





  // activityAttempt(event) {
  //   if (event.value == '1') {
  //     this.schedulePackageForm.controls.activityTimeDuration.setValidators([Validators.required, this.gv.twoDigit(), this.gv.numberOnly(),]);
  //     this.schedulePackageForm.controls.activityTimeDuration.updateValueAndValidity();
  //   } else if (event.value == '0') {
  //     this.schedulePackageForm.controls.activityTimeDuration.clearValidators();
  //     this.schedulePackageForm.controls.activityTimeDuration.setValidators(null);
  //     this.schedulePackageForm.controls.activityTimeDuration.setValue(null);
  //     this.schedulePackageForm.controls.activityTimeDuration.markAsUntouched();
  //     this.schedulePackageForm.controls.activityTimeDuration.updateValueAndValidity();
  //   }
  //   else {
  //     this.schedulePackageForm.controls.activityTimeDuration.clearValidators();
  //     this.schedulePackageForm.controls.activityTimeDuration.setValidators(null);
  //     this.schedulePackageForm.controls.activityTimeDuration.markAsUntouched();
  //     this.schedulePackageForm.controls.activityTimeDuration.updateValueAndValidity();
  //   }
  // }

  // ********************* Add Criteria popup *****************//
  addcriteria(item, index, formArr, type) {

    var addcriteria = this.matDialog.open(AddcriteriaComponent, {

      width: '55%',
      height: '100%',
      autoFocus: false,
      closeOnNavigation: false,
      disableClose: true,
      position: { right: '0' },
      data: {
        dataKey: item,
        index: index,
        form: formArr,
        key: '0',
        type: type,
        successMessage: this.successMessage,
        event: 'critiria'
      }
    });
  }


  getProfileFormToUse(org) {
    let data = {
      orgId: org ? parseInt(org) : org
    }
    this.scheduleService.getProfiletouse(data).subscribe((response: any) => {
      if (response.success) {
        this.profileToUse = response.data;
        this.profileToUse.splice(0, 0, { formTemplateId: 0, formTemplateName: 'None' })
      } else {
        this.sendData.warning(response.message);
      }
    });
  }

  getdriveList() {
    this.api.getCampusDriveList({}).subscribe((data: any) => {
      if (data.success) {
        this.driveList = data.data;
        this.newDrive = data[0]?.drive_name;
        this.driveList.splice(0, 0, { drive_master_id: 0, drive_name: 'None' })
      } else {
        this.sendData.warning(data.message);
      }
    })
  }

  getassessmentForm() {
    this.api.getAssessmentFormToUse().subscribe((data: any) => {
      if (data.success) {
        this.assessmentFeedback = data.data;
        this.assessmentFeedback.splice(0, 0, { feedbackFormId: 0, feedbackFormName: 'None' })
      } else {
        this.sendData.warning(data.message);
      }
    })
  }

  getCampusDriveId(event) {
    if (event) {
      this.schedulePackageForm.controls.driveId.setValue(event);
      this.showResultEmailNotify = true;
    }
    else if (event == 0) {
      this.schedulePackageForm.controls.driveId.setValue(event);
      this.showResultEmailNotify = false;
      this.schedulePackageForm.controls.resultNotifyFailure.setValue('0');
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.clearValidators();
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.setValidators(null);
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.setValue(null);
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.markAsUntouched();
      this.schedulePackageForm.controls.resultNotifyFailureTemplate.updateValueAndValidity();
    }
  }
  isBulkAssign() {
    this.templates = [
      {
        value: this.Upload_FirstLevelCandidates,
        name: 'Default Template',
        id: 1
      },
      {
        value: this.Upload_AssessmentScore,
        name: 'Bajaj GCT Template',
        id: 2
      }
    ]

  }
  downloadTemplate() {
    if (this.selectedTemplate == 1) {

      const excel = `assets/templates/Default Template.csv`;
      window.open(excel, '_blank');
    }
    if (this.selectedTemplate == 2) {
      const excel = `/assets/templates/Bajaj GCT Template.csv`;
      window.open(excel, '_blank');
    }
  }
  changeClient(event) {
    this.selectedTemplate = event.value;
    this.selectedTemplateId = event.id;
    this.showError = false;
    this.showBajajError = false;
    this.uploadnamechange = false;
    this.uploadFileShow = false;
    this.csvRows = [];
  }
  uploadText() {
    return this.selectedTemplate == 2 ? 'Bajaj GCT Template' : 'Default Template'
  }

  // Passing task data to patching function
  patchSequentialForm(tasksDetails) {
    if (tasksDetails) {
      this.getsequentialArr.clear()
      let taskLength = tasksDetails.length;  // To disabled last break time input box
      tasksDetails.forEach((element, i) => {
        this.getsequentialArr.push(this.patching(element, i, taskLength));
      });
    }
  }

  // Patching Date to display on table
  patching(data, i, taskLength) {
    if (this.schedulePackageForm.get('assessmentFlow').value == 'sequential') {
      return this.fb.group({
        duration: [data ? data['duration'] : null],
        id: [data ? data['id'] : null],
        level: [data ? data['level'] : null],
        name: [data ? data['name'] : null],
        subType: [data ? data['subType'] : null],
        type: [data ? data['type'] : null],
        startTime: [null, i == 0 ? [Validators.required] : []],
        startDuration: [null, [Validators.required, this.gv.numberOnly(), Validators.maxLength(6)]],
        breakTime: [i != taskLength - 1 ? null : { value: null, disabled: true }, [this.gv.numberOnly(), Validators.maxLength(3)]],
        endTime: [null],
        criteriaDet: this.fb.array([])
      })
    } else {
      return this.fb.group({})
    }

  }
  // Calucate Schedule Date Time
  onSequentialStartDateChange(date: Date, index) {
    this.TimeValidationCheckForSequential = new Date(this.getsequentialArr.controls[index]['controls'].startTime.value)
    this.startDuration('', index, this.getsequentialArr?.controls?.length, '')
  }

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
      let endTimeWithTestDuration = currentStartDuration + taskDuration
      let startTime = currentTaskStartDateTime.setTime(currentTaskStartDateTime.getTime() + (calucateTime * 60 * 1000));
      this.getsequentialArr.controls[index + 1]['controls'].startTime.setValue(new Date(startTime).toISOString());

      // calculate test end time
      let calucateEndDateTime = this.getsequentialArr.controls[index]['controls'].startTime.value ? new Date(this.getsequentialArr.controls[index]['controls'].startTime.value) : new Date();
      let endTime = calucateEndDateTime.setTime(calucateEndDateTime.getTime() + (endTimeWithTestDuration * 60 * 1000));
      this.getsequentialArr.controls[index]['controls'].endTime.setValue(new Date(endTime).toISOString());
    }

    if (index == 0) { // Set Schedule Start DateTime
      currentStartDuration = this.getsequentialArr.controls[index]['controls'].startDuration.value ? parseInt(this.getsequentialArr.controls[index]['controls'].startDuration.value) : 0;
      currentTaskStartDateTime = this.getsequentialArr.controls[index]['controls'].startTime.value ? new Date(this.getsequentialArr.controls[index]['controls'].startTime.value) : new Date();
      this.schedulePackageForm.get('scheduleDate').setValue(new Date(currentTaskStartDateTime).toISOString());
    }
    // Setting test details end time for last index
    if (index == this.getsequentialArr.controls.length - 1) {
      currentTaskStartDateTime = new Date();
      currentStartDuration = this.getsequentialArr.controls[index]['controls'].startDuration.value ? parseInt(this.getsequentialArr.controls[index]['controls'].startDuration.value) : 0;

      // set last index test end datetime
      let endTime = '';
      currentTaskStartDateTime = this.getsequentialArr.controls[index]['controls'].startTime.value ? new Date(this.getsequentialArr.controls[index]['controls'].startTime.value) : new Date();
      endTime = currentTaskStartDateTime.setTime(currentTaskStartDateTime.getTime() + ((currentStartDuration + taskDuration) * 60 * 1000));
      this.getsequentialArr.controls[index]['controls'].endTime.setValue(new Date(endTime).toISOString());

      // Set Schedule End Date
      this.schedulePackageForm.get('scheduleEndDate').setValue(new Date(endTime).toISOString());
    }
  }

  // Break Time
  breakTime(event, index, checkDisbaled) {
    if (checkDisbaled == false) {
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
            this.getCalucateNextTaskStartTime(lastTaskStartDateTime, lastStartDuration, lastBreakTime, TaskDuration, index)
          }

        } else {  // Calucate if break time
          lastTaskStartDateTime = this.getsequentialArr.controls[index]['controls'].startTime.value ? new Date(this.getsequentialArr.controls[index]['controls'].startTime.value) : '';
          lastStartDuration = this.getsequentialArr.controls[index]['controls'].startDuration.value ? parseInt(this.getsequentialArr.controls[index]['controls'].startDuration.value) : 0;
          lastBreakTime = this.getsequentialArr.controls[index]['controls'].breakTime.value ? parseInt(this.getsequentialArr.controls[index]['controls'].breakTime.value) : 0;
          TaskDuration = this.getsequentialArr.controls[index]['controls'].duration.value ? this.getsequentialArr.controls[index]['controls'].duration.value : 0;
          if (this.getsequentialArr.controls[index]['controls'].startTime.value != '') {
            this.getCalucateNextTaskStartTime(lastTaskStartDateTime, lastStartDuration, lastBreakTime, TaskDuration, index)
          }
        }
      }
    }

  }
  getCalucateNextTaskStartTime(startDateTime, startDuration, breakTime, taskDuration, index) {
    let calucateTime = taskDuration + startDuration + breakTime;
    let startTime = startDateTime.setTime(startDateTime.getTime() + (calucateTime * 60 * 1000));
    this.getsequentialArr.controls[index + 1]['controls'].startTime.setValue(new Date(startTime).toISOString());
  }// End Break Time


  checkFinalDateTime() {
    let startTimes = [];
    let endTimes = [];
    let startDateTime = new Date('')
    this.getsequentialArr.value.forEach(element => {
      endTimes.push(new Date(_.pick(element, ['endTime']).endTime).toISOString())
      if (element.breakTime != '' && element.breakTime != null && element.breakTime != 0 && element.breakTime != '0' && element.breakTime == '') {
        startTimes.push(new Date(_.pick(element, ['startTime']).startTime).toISOString())
      } else {
        startDateTime = new Date(element.startTime);
        let passStartDateTime = new Date(startDateTime);
        startTimes.push(new Date(passStartDateTime.setMinutes(startDateTime.getMinutes() + 1)).toISOString());
      }
    });

    const intersection = this.findIntersection(startTimes, endTimes)
    if (intersection !== null) {
      this.testTimeCheck = true;
      this.sendData.warning(`Schedule start on datetime mismatched between test ${intersection[0] + 1} and ${intersection[1] + 1}`);
    } else {
      this.testTimeCheck = false;
    }
  }

  findIntersection(startTimes, endTimes) {
    for (let i = 0; i < startTimes.length; i++) {
      for (let j = i + 1; j < startTimes.length; j++) {
        if ((startTimes[i] >= startTimes[j] && startTimes[i] <= endTimes[j]) ||
          (endTimes[i] >= startTimes[j] && endTimes[i] <= endTimes[j]) ||
          (startTimes[j] >= startTimes[i] && startTimes[j] <= endTimes[i]) ||
          (endTimes[j] >= startTimes[i] && endTimes[j] <= endTimes[i])) {
          return [i, j]; // return the indexes of the intersecting intervals
        }
      }
    }
    return null; // no intersection found
  }

  clearScheduleDetails() {
    this.getsequentialArr.controls.forEach((element) => {
      element['controls'].breakTime.setValue(null);
      element['controls'].startDuration.setValue(null);
      element['controls'].startTime.setValue(null);
      element['controls'].endTime.setValue(null);
    })
  }


  get f() {
    return this.schedulePackageForm.controls;
  }

  get getsequentialArr() {
    return this.schedulePackageForm.controls['testDetails'] as FormArray;
  }


  get batchname() {
    return this.schedulePackageForm.get('scheduleName');
  }

  get scheduledescription() {
    return this.schedulePackageForm.get('scheduleDescription');
  }

  get profileform() {
    return this.schedulePackageForm.get('formTemplateId');
  }

  get driveid() {
    return this.schedulePackageForm.get('driveId');
  }

  get assessmentflow() {
    return this.schedulePackageForm.get('assessmentFlow');
  }

  get choosetemplate() {
    return this.schedulePackageForm.get('templateId');
  }



  get feedBack() {
    return this.schedulePackageForm.get('feedback');
  }

  get drivename() {
    return this.schedulePackageForm.get('campusDrivename');
  }


  get choosetemplatename() {
    return this.schedulePackageForm.get('chooseTemplatename');
  }

  get publishdate() {
    return this.schedulePackageForm.get('publishDate');
  }

  get orgid() {
    return this.schedulePackageForm.get('orgId');
  }

  get starttime() {
    return this.schedulePackageForm.get('startTime');
  }

  // get BrowserTolerance() {
  //   return this.schedulePackageForm.get('browserTolerance');
  // }

  // get IdealTimeCapture() {
  //   return this.schedulePackageForm.get('idealTimeCapture');
  // }
  // get Popupduratiob() {
  //   return this.schedulePackageForm.get('idealTimePopupDuration');
  // }

  // get activityTimeRestrict() {
  //   return this.schedulePackageForm.get('activityTimeRestrict');
  // }


  // get activityTimeDuration() {
  //   return this.schedulePackageForm.get('activityTimeDuration');
  // }

  // get numberOfattempt() {
  //   return this.schedulePackageForm.get('numberOfattempt');
  // }

  // get attemptRestrict() {
  //   return this.schedulePackageForm.get('attemptRestrict');
  // }

  get resultSuccessed() {
    return this.schedulePackageForm.get('resultNotifySuccessTemplate');
  }

  get resultFailed() {
    return this.schedulePackageForm.get('resultNotifyFailureTemplate');
  }



}

