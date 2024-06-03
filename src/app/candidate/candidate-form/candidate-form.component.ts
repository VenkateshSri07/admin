import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserAPIService } from 'src/app/rest-api/user-api/user-api.service';
import { LoadingService } from './../../rest-api/loading.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { Store } from '@ngrx/store';
import { assessmentIDAction } from 'src/app/login/redux/login.actions';
import { AssessmentTasksReducerState } from 'src/app/assessment/landing-page/redux/landing-page.model';
import { Router } from '@angular/router';
import { type } from 'os';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/rest-api/web-socket/web-socket.service';
// import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY'
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'uap-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CandidateFormComponent implements OnInit {
  @ViewChild('confirm', { static: false }) confirm: TemplateRef<any>;
  @ViewChild('mobilepopup', { static: false }) mobilepopup: TemplateRef<any>;
  candidateUapForm: any = FormGroup;
  verifySuccessImg: boolean = false;
  fileName: any;
  checked: any;
  fileSize: any;
  pdfFile: any;
  verified: boolean = false;
  internship: boolean = false;
  validDocument: boolean = true;
  templateValue: string;
  heading: string;
  otpForm: FormGroup;
  assessmentCode: any;
  // Timer verification code
  timeLeft: number;
  interval;
  formBuilder: any;
  otpToken: any;
  candidateDetials: any;
  displayFormField: any;
  degreeData: any;
  degreeArray:any;
  fieldsToshow ={};
  tempFormField :any;
  specializationArray:any;
  samplecandidateJson: any;
  colleges: any;
  states: any;
  districts: any;
  verifybtn: boolean = true;
  verifyimgic: boolean = false;
  resumeCount = 0;
  yearValidation = 0;
  blobToken = environment.blobToken
  productionUrl = environment.NODE_URL == "https://uapedgeservice.lntedutech.com" || environment.NODE_URL == "https://demoassessedgeservice.lntedutech.com" || environment.NODE_URL == "https://unifiededgegatewayuat.lntedutech.com"?true:false;
  profileSync ="";
  constructor(
    public fb: FormBuilder,
    private _loading: LoadingService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private api: UserAPIService,
    private router: Router,
    private store: Store<AssessmentTasksReducerState>,
    public websocket: WebSocketService
  ) {
    var scheduleId = localStorage.getItem('scheduleId');
    if(scheduleId == null ||  scheduleId == undefined || scheduleId.length == 0 ){
      this.api.logout();
    }
  }

  ngOnInit(): void {
    // this.socketProgres();
    // this.checkUserLoginActivity();
    this._loading.setLoading(false, 'request.url');
    this.formInitializeOTP();
    this.displayCandidateFields();
    this.onStateChange();
    this.profileSync = localStorage.getItem("candidateProfileForm");
  }

  async displayCandidateFields() {
    this.samplecandidateJson = JSON?.parse(localStorage.getItem('details'));

    let obj = {
      orgId: JSON.parse(localStorage.getItem('orgId')),
      formTemplateId: JSON.parse(localStorage.getItem('formtemplate'))
    };
    this.api.candidateDisplayForm(obj).subscribe(async (res: any) => {
      if (res.success) {
        this.fieldsToshow = res.data[0].fieldsToshow;

        this.displayFormField = res.data[0].formFields;
        this.tempFormField = res.data[0].formFields;

        //validation with dynamic
        let validationObj = {
          formTemplateId: [''],
          orgId: [''],
          verified: ['', Validators.required]
        };
        for (var elem in this.displayFormField) {
          if (this.displayFormField[elem].type == 'array') {
            if (elem == "UG" && this.samplecandidateJson.degree == "Dual") {
              for (var elem1 of this.displayFormField[elem].subtype) {
                if (elem1.type != undefined) {
                  elem1.mandatory = false;
                  elem1.edit = true;
                  validationObj[elem1.key] = await this.formValidation(elem1.type, elem1.mandatory, !elem1.edit, elem1.key);
                }
              }
              this.displayFormField[elem].mandatory = false;
              this.displayFormField[elem] = this.displayFormField[elem];
            } else if (elem == "PG" && this.samplecandidateJson.degree == "Dual") {
              for (var elem1 of this.displayFormField[elem].subtype) {
                if (elem1.type != undefined) {
                  elem1.mandatory = true;
                  elem1.edit = true;
                  validationObj[elem1.key] = await this.formValidation(elem1.type, elem1.mandatory, !elem1.edit, elem1.key);
                }
              }
              this.displayFormField[elem].mandatory = true;
              this.displayFormField[elem] = this.displayFormField[elem];
            } else {
              for (var elem1 of this.displayFormField[elem].subtype) {
                if (elem1.type != undefined) {
                  validationObj[elem1.key] = await this.formValidation(elem1.type, elem1.mandatory, !elem1.edit, elem1.key);
                }
              }
            }
          } else {
            if (this.displayFormField[elem].type != undefined) {
              validationObj[elem] = await this.formValidation(
                this.displayFormField[elem].type,
                this.displayFormField[elem].mandatory,
                !this.displayFormField[elem].edit,
                this.displayFormField[elem].key
              );
            }
          }
        }
        this.candidateUapForm = this.fb.group(validationObj);
        if (this.candidateUapForm.controls != undefined && this.samplecandidateJson != undefined) {
          //this function will work only if the candidate not updated in form with approve
          if (this.profileSync == 'candidateMyProfile') {
            this.candidateUapForm.controls['name']?.patchValue(this.samplecandidateJson?.name);
            this.candidateUapForm.controls['gender']?.patchValue(this.samplecandidateJson?.gender);
            this.candidateUapForm.controls['emailId']?.patchValue(this.samplecandidateJson?.emailId);
            this.candidateUapForm.controls['alternateEmailId']?.patchValue(
              this.samplecandidateJson?.alternateEmailId
            );
            this.candidateUapForm.controls['phonenumber'].patchValue(
              this.samplecandidateJson?.phonenumber
            );
            if (
              this.samplecandidateJson?.phonenumber != undefined &&
              this.samplecandidateJson?.phonenumber != '' && this.samplecandidateJson?.isMobileVerified != undefined && this.samplecandidateJson?.isMobileVerified
            ) {
              this.verifybtn = false;
              this.verifyimgic = true;
              // this.candidateUapForm.controls['phonenumber'].disable()
            }
            this.getSpecialization();
            if (this.samplecandidateJson?.specialization != undefined && this.samplecandidateJson?.specialization != "") {
              this.specializationArray = [this.samplecandidateJson?.specialization];
              this.candidateUapForm.controls['specialization']?.patchValue(
                this.samplecandidateJson?.specialization
              );
            }
            //  else {
            //   this.getSpecialization();
            // }

            if (this.samplecandidateJson?.state != undefined) {
              this.candidateUapForm.controls['state']?.patchValue(this.samplecandidateJson?.state);
              this.onDistrictChange(this.samplecandidateJson?.state)
              // this.onCollegeChange(this.samplecandidateJson.district)

              this.candidateUapForm.controls['district']?.patchValue(
                this.samplecandidateJson?.district
              );
              this.candidateUapForm.controls['collegename']?.patchValue(
                this.samplecandidateJson?.collegename
              );
            }


            if (this.samplecandidateJson?.educationDetails != undefined && this.samplecandidateJson?.educationDetails.length) {
              this.samplecandidateJson?.educationDetails.forEach(elem => {
                this.candidateUapForm.controls[elem.level + 'Grading']?.patchValue(elem.gradeSystem);
                this.candidateUapForm.controls[elem.level]?.patchValue(elem.percentage);
                this.candidateUapForm.controls["yearOfPassing" + elem.level]?.patchValue(elem.year_of_passing);
              });
            }

            this.getDegree(this.samplecandidateJson.chooseTemplatename)
            if (this.samplecandidateJson?.degree != undefined && this.samplecandidateJson?.degree != "") {
              this.degreeArray = [this.samplecandidateJson?.degree];
              this.candidateUapForm.controls['degree']?.patchValue(this.samplecandidateJson?.degree);
              this.onDegreeSelect(this.samplecandidateJson?.degree);
            } 
            // else {
            //   this.getDegree(this.samplecandidateJson.chooseTemplatename)
            // }

            this.candidateUapForm.controls['backlogActiveandDead']?.patchValue(
              this.samplecandidateJson.backlogActiveandDead != undefined
                ? this.samplecandidateJson.backlogActiveandDead
                : false
            );
            this.candidateUapForm.controls['diplomaBeforeBEorBTech']?.patchValue(
              this.samplecandidateJson?.diplomaBeforeBEorBTech != undefined
                ? this.samplecandidateJson?.diplomaBeforeBEorBTech
                : false
            );
            this.candidateUapForm.controls['internAtBALorCTL']?.patchValue(
              this.samplecandidateJson?.internAtBALorCTL != undefined
                ? this.samplecandidateJson?.internAtBALorCTL
                : false
            );
            this.anyGap({ value: this.candidateUapForm.get('internAtBALorCTL').value })
            this.candidateUapForm.controls['experience']?.patchValue(
              this.samplecandidateJson?.experience
            );

            // if (this.samplecandidateJson?.validateDocument != undefined) {
            //   this.candidateUapForm.controls['validateDocument']?.patchValue(
            //     this.samplecandidateJson?.validateDocument != undefined
            //       ? this.samplecandidateJson?.validateDocument
            //       : true
            //   );

            //   this.updateValidateDocument({ value: this.candidateUapForm.get('validateDocument').value })

            //   this.candidateUapForm.controls['remarks']?.patchValue(
            //     this.samplecandidateJson?.remarks
            //   );
            // }

            this.candidateUapForm.controls['resume']?.patchValue(this.samplecandidateJson?.resume);
            this.fileName = this.samplecandidateJson?.resume != undefined ? this.samplecandidateJson?.resumeFileName != undefined ? this.samplecandidateJson?.resumeFileName : "file.pdf" : "";

            this.candidateUapForm.controls['verified']?.patchValue(
              this.samplecandidateJson?.verified != undefined
                ? this.samplecandidateJson?.verified
                : false
            );
            this.verified =
              this.samplecandidateJson?.verified != undefined
                ? this.samplecandidateJson?.verified
                : false;

            this.candidateUapForm.controls['validateDocument'].clearValidators();
            this.candidateUapForm.controls['validateDocument'].setValidators(null);
            this.candidateUapForm.controls['validateDocument'].markAsUntouched();
            this.candidateUapForm.controls['validateDocument'].updateValueAndValidity();

            // if the candidate submited for 2nd time then all fields should be disabled
            if (this.samplecandidateJson?.updatedJson == true) {
              this.verifybtn = false;
              this.verifyimgic = true;
              this.candidateUapForm.controls['phonenumber'].disable()
              this.candidateUapForm.controls['alternateEmailId'].disable()
              this.candidateUapForm.controls['gender'].disable()
              this.candidateUapForm.controls['specialization'].disable()
              this.candidateUapForm.controls['degree'].disable()
              this.candidateUapForm.controls['state'].disable()
              this.candidateUapForm.controls['district'].disable()
              this.candidateUapForm.controls['collegename'].disable()
              this.candidateUapForm.controls['backlogActiveandDead'].disable()
              this.candidateUapForm.controls['diplomaBeforeBEorBTech'].disable()
              this.candidateUapForm.controls['internAtBALorCTL'].disable()
              this.candidateUapForm.controls['resume'].disable()
              if (this.samplecandidateJson?.experience != undefined && this.samplecandidateJson?.experience != "") {
                this.candidateUapForm.controls['experience'].disable()
              }

              // this.candidateUapForm.controls['validateDocument'].disable()
              // if(this.samplecandidateJson?.remarks != undefined && this.samplecandidateJson?.remarks != ""){
              //   this.candidateUapForm.controls['remarks'].disable()
              // }

              if (this.samplecandidateJson?.educationDetails != undefined && this.samplecandidateJson?.educationDetails.length) {
                this.samplecandidateJson?.educationDetails.forEach(elem => {
                  this.candidateUapForm.controls[elem.level + 'Grading']?.patchValue(elem.gradeSystem);
                  this.candidateUapForm.controls[elem.level]?.patchValue(elem.percentage);
                  this.candidateUapForm.controls["yearOfPassing" + elem.level]?.patchValue(elem.year_of_passing);
                  if (elem.gradeSystem != undefined && elem.gradeSystem != null && elem.gradeSystem != '') {
                    this.candidateUapForm.controls[elem.level + 'Grading'].disable()
                  }

                  if (elem.percentage != undefined && elem.percentage != null && elem.percentage != '') {
                    this.candidateUapForm.controls[elem.level].disable()
                  }

                  if (elem.gradeSystem != undefined && elem.gradeSystem != null && elem.gradeSystem != '') {
                    this.candidateUapForm.controls["yearOfPassing" + elem.level].disable()
                  }

                });
              }
            }
          } else {
            // this flow will work while login to the assessment for the first time
            this.candidateUapForm.controls['name']?.patchValue(this.samplecandidateJson?.name);
            this.candidateUapForm.controls['gender']?.patchValue(this.samplecandidateJson?.gender);
            this.candidateUapForm.controls['emailId']?.patchValue(this.samplecandidateJson?.emailId);
            this.candidateUapForm.controls['alternateEmailId']?.patchValue(
              this.samplecandidateJson?.alternateEmailId
            );
            if (this.samplecandidateJson?.alternateEmailId != undefined && this.samplecandidateJson?.alternateEmailId != '') {
              this.candidateUapForm.controls['alternateEmailId'].disable()
            }
            if (this.samplecandidateJson?.gender != undefined && this.samplecandidateJson?.gender != '') {
              this.candidateUapForm.controls['gender'].disable()
            }
            this.candidateUapForm.controls['phonenumber'].patchValue(
              this.samplecandidateJson?.phonenumber
            );
            if (
              this.samplecandidateJson?.phonenumber != undefined &&
              this.samplecandidateJson?.phonenumber != '' && this.samplecandidateJson?.isMobileVerified != undefined && this.samplecandidateJson?.isMobileVerified
            ) {
              this.verifybtn = false;
              this.verifyimgic = true;
              this.candidateUapForm.controls['phonenumber'].disable()
            }

            if (this.samplecandidateJson?.specialization != undefined && this.samplecandidateJson?.specialization != "") {
              this.specializationArray = [this.samplecandidateJson?.specialization];
              this.candidateUapForm.controls['specialization']?.patchValue(
                this.samplecandidateJson?.specialization
              );
              this.candidateUapForm.controls['specialization'].disable()
            } else {
              this.getSpecialization();
            }

            if (this.samplecandidateJson?.state != undefined) {
              this.candidateUapForm.controls['state']?.patchValue(this.samplecandidateJson?.state);
              this.onDistrictChange(this.samplecandidateJson?.state)
              this.candidateUapForm.controls['district']?.patchValue(
                this.samplecandidateJson?.district
              );
              this.candidateUapForm.controls['collegename']?.patchValue(
                this.samplecandidateJson?.collegename
              );
            }


            if (this.samplecandidateJson?.educationDetails != undefined && this.samplecandidateJson?.educationDetails.length) {
              this.samplecandidateJson?.educationDetails.forEach(elem => {
                this.candidateUapForm.controls[elem.level + 'Grading']?.patchValue(elem.gradeSystem);
                this.candidateUapForm.controls[elem.level]?.patchValue(elem.percentage);
                this.candidateUapForm.controls["yearOfPassing" + elem.level]?.patchValue(elem.year_of_passing);
                if (elem.gradeSystem != undefined && elem.gradeSystem != null && elem.gradeSystem != '') {
                  this.candidateUapForm.controls[elem.level + 'Grading'].disable()
                }

                if (elem.percentage != undefined && elem.percentage != null && elem.percentage != '') {
                  this.candidateUapForm.controls[elem.level].disable()
                }

                if (elem.gradeSystem != undefined && elem.gradeSystem != null && elem.gradeSystem != '') {
                  this.candidateUapForm.controls["yearOfPassing" + elem.level].disable()
                }

              });
            }

            if (this.samplecandidateJson?.degree != undefined && this.samplecandidateJson?.degree != "") {
              this.degreeArray = [this.samplecandidateJson?.degree];
              this.candidateUapForm.controls['degree']?.patchValue(this.samplecandidateJson?.degree);
              this.onDegreeSelect(this.samplecandidateJson?.degree);
              this.candidateUapForm.controls['degree'].disable()
            } else {
              this.getDegree(this.samplecandidateJson.chooseTemplatename)
            }

            this.candidateUapForm.controls['backlogActiveandDead']?.patchValue(
              this.samplecandidateJson.backlogActiveandDead != undefined
                ? this.samplecandidateJson.backlogActiveandDead
                : false
            );
            this.candidateUapForm.controls['diplomaBeforeBEorBTech']?.patchValue(
              this.samplecandidateJson?.diplomaBeforeBEorBTech != undefined
                ? this.samplecandidateJson?.diplomaBeforeBEorBTech
                : false
            );
            this.candidateUapForm.controls['internAtBALorCTL']?.patchValue(
              this.samplecandidateJson?.internAtBALorCTL != undefined
                ? this.samplecandidateJson?.internAtBALorCTL
                : false
            );
            this.anyGap({ value: this.candidateUapForm.get('internAtBALorCTL').value })
            this.candidateUapForm.controls['experience']?.patchValue(
              this.samplecandidateJson?.experience
            );

            if (this.samplecandidateJson?.validateDocument != undefined) {
              this.candidateUapForm.controls['validateDocument']?.patchValue(
                this.samplecandidateJson?.validateDocument != undefined
                  ? this.samplecandidateJson?.validateDocument
                  : true
              );

              this.updateValidateDocument({ value: this.candidateUapForm.get('validateDocument').value })

              this.candidateUapForm.controls['remarks']?.patchValue(
                this.samplecandidateJson?.remarks
              );
            }

            this.candidateUapForm.controls['resume']?.patchValue(this.samplecandidateJson?.resume);
            this.fileName = this.samplecandidateJson?.resume != undefined ? this.samplecandidateJson?.resumeFileName != undefined ? this.samplecandidateJson?.resumeFileName : "file.pdf" : "";

            this.candidateUapForm.controls['verified']?.patchValue(
              this.samplecandidateJson?.verified != undefined
                ? this.samplecandidateJson?.verified
                : false
            );
            this.verified =
              this.samplecandidateJson?.verified != undefined
                ? this.samplecandidateJson?.verified
                : false;
          }
        }
      }
    });
  }

  async formValidation(type, mandatory,disabled,key) {
    if (type == 'name' && mandatory) {
      return [
        {value: '', disabled: disabled},
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('[a-zA-Z][a-zA-Z ]+')
        ])
      ];
    } else if (type == 'email' && mandatory) {
      return [
        {value: '', disabled: disabled},
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
        ])
      ];
    } else if (type == 'number' && mandatory) {
      return [
        {value: '', disabled: disabled},
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('[1-9]{1}[0-9]{9}')
        ])
      ];
    } else if (type == 'cgpa' && mandatory) {
      if (this.samplecandidateJson[key + "Grading"] == "cgpa") {
        return [
          { value: '', disabled: disabled },
          Validators.compose([
            Validators.required,
            Validators.min(0),
            Validators.max(10)
          ])
        ];
      } else {
        return [
          { value: '', disabled: disabled },
          Validators.compose([
            Validators.required,
            Validators.min(11),
            Validators.max(100)
          ])
        ];
      }
    } else if ((type == 'text' || type == 'upload' || type == 'dropdown') && mandatory) {
      return [{ value: '', disabled: disabled }, Validators.required];
    } else if (type == 'checkbox' && mandatory) {
      return [{ value: '', disabled: disabled }];
    } else {
      return [''];
    }
  }

  formInitializeOTP() {
    this.otpForm = this.fb.group({
      verify: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)])
      ]
    });
  }

  confirmationCandidateData() {

    if (this.profileSync != 'candidateMyProfile') {
      this.candidateUapForm.controls['validateDocument'].clearValidators();
      this.candidateUapForm.controls['validateDocument'].setValidators([Validators.required]);
      this.candidateUapForm.controls['validateDocument'].markAsUntouched();
      this.candidateUapForm.controls['validateDocument'].updateValueAndValidity();
    }
    var educationArray = ["SSLC", "HSC", "UG", "PG", "PhD"];
    let educationCount = 0
    this.yearValidation = 0;
    for(var elem of educationArray){
      if(elem != "SSLC"){
        if(this.candidateUapForm.get("yearOfPassing" + elem).value != null && this.candidateUapForm.get("yearOfPassing" + elem).value != '' && this.candidateUapForm.get("yearOfPassing" + elem).value != undefined ){
          this.onYearSelect(this.candidateUapForm.get("yearOfPassing" + elem).value,educationArray[educationCount-1],educationArray[educationCount])
        }
        }
        educationCount = educationCount + 1;
    }

    this.resumeCount = this.resumeCount + 1;
    if (this.candidateUapForm.valid) {
      if (this.verifyimgic) {
        if(this.yearValidation == 0){
        // this.toast.success('success');
        this.dialog.open(this.confirm, {
          width: '572px',
          height: '386px',
          panelClass: 'my-custom-dialog-class',
          disableClose: true
        });
      }
      } else {
        this.toast.error('Please verify mobile number');
      }
    } else {
      this.candidateUapForm.markAllAsTouched();
      this.toast.error('Please fill all required entry fields');
    }
  }

  phoneValueChange(){
    if(this.candidateUapForm.controls['phonenumber']?.value?.length <10){
      this.verifybtn = true;
      this.verifyimgic = false;
    }
  }

  // Verify OPT Enter a Number
  verifyOtp(type) {
    this.otpForm.controls['verify']?.patchValue(null);
    let data = {
      mobile: this.candidateUapForm.get('phonenumber').value,
      type: 'generate-otp',
      user_id: 12345
    };
    this.api.generateOTP(data).subscribe((res: any) => {
      if (res.success) {
        // localStorage.removeItem('details')
        this.otpToken = res.token;
        this.startTimer(30);
        this.toast.success(res.message);
      } else {
        // console.log(res.message)
        this.toast.error(res.message);
        this.verifybtn = true;
        this.verifyimgic = false;
      }
    });
    this.dialog.open(this.mobilepopup, {
      width: '572px',
      height: '386px',
      panelClass: 'my-custom-dialog-class',
      disableClose: true
    });
  }
  // Resend OTP
  resendOTP(type) {
    this.otpForm.controls['verify']?.patchValue(null);
    let data = {
      mobile: this.candidateUapForm.get('phonenumber').value,
      type: 'generate-otp',
      user_id: 12345
    };
    this.api.generateOTP(data).subscribe((res: any) => {
      if (res.success) {
        this.otpToken = res.token;
        this.startTimer(30);
        this.toast.success(res.message);
      } else {
        this.toast.error(res.message);
      }
    });
  }
  // Validation OTP
  ValidateOTP(type) {
    clearInterval(this.interval);
    let data = {
      token: this.otpToken,
      otp: this.otpForm.get('verify').value,
      mobile: this.candidateUapForm.get('phonenumber').value
    };
    if(this.otpForm.valid){
    this.api.validateOTP(data).subscribe((res: any) => {
      if (res.success) {
        this.verifybtn = false;
        this.verifyimgic = true;
        this.candidateUapForm.controls['phonenumber'].disable()
        let getdetails = JSON.parse(localStorage.getItem('details'));
        getdetails.phonenumber = data.mobile;
        localStorage.setItem('details', JSON.stringify(getdetails));
        this.toast.success(res.message);
        this.closepopup();
        clearInterval(this.interval);
      } else {
        this.startTimer(30);
        this.toast.error(res.message);
      }
    });
  }
  }
  // Resume Upload In candidate form Functionality
  onFileChange(event) {
    if (event.target.files[0]) {
      this.pdfFile = event.target.files[0];
      const fd = new FormData();
      fd.append('file', event.target.files[0]);
      fd.append('type', 'pdf');
      this.api.fileUpload(fd).subscribe((res: any) => {
        if (res.success) {
          this.fileName = event.target.files[0]['name'];
          this.fileSize = (Number(event.target.files[0]['size']) / 1024).toFixed(2);
          if (res.data && this.productionUrl == true) {
            var imageUrl = encodeURI(res.data);
            this.candidateUapForm.patchValue({
              resume: imageUrl + this.blobToken
            });
          } else {
            var imageUrl = encodeURI(res.data);
            this.candidateUapForm.patchValue({
              resume: imageUrl
            });
          }
          this.candidateUapForm.get('resume').updateValueAndValidity();
        } else {
          this.toast.warning(res?.message);
          this.candidateUapForm.patchValue({
            resume: null
          });
        }
      });
    } else {
      this.toast.warning('Maximum file size is 2 MB', 'Not Uploaded');
    }
  }
  closepopup() {
    this.dialog.closeAll();
  }
  cancelFile() {
    this.pdfFile = false;
    this.fileSize = false;
    this.fileName = false;
    this.candidateUapForm.get('resume').setValue(null)
  }
  anyGap(event) {
    if (event.value == false) {
      this.candidateUapForm.removeControl('experience'); 
      this.internship = false;
    } else {
      this.candidateUapForm?.addControl('experience', new FormControl('',   Validators.compose([
        Validators.required,
        Validators.pattern(/^-?(0|[0-9]\d*)?$/),
        Validators.min(1),
        Validators.max(99)
      ])));
      this.internship = true;
    }
  }
  updateValidateDocument(event) {
    if (event.value == true) {
      this.candidateUapForm.removeControl('remarks'); 
      this.validDocument = true;
    } else {
      this.candidateUapForm?.addControl('remarks', new FormControl('',   Validators.compose([
        Validators.required,
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)
      ])));
      this.validDocument = false;
    }
  }
  open(event) {
    this.verified = event.checked;
  }

  onFormdataSubmit() {
    let candidateValues = this.candidateUapForm.value;
    let candiDateOrgFormTemplateIdS = {
      // formTemplateId: this.samplecandidateJson.formTemplateId,
      scheduleId: this.samplecandidateJson.scheduleId,
      // orgId: this.samplecandidateJson.orgId,
      isSubmitted: true,
      isMobileVerified: true
    };
    let candidateProfilevalues = Object.assign(candiDateOrgFormTemplateIdS,candidateValues);
    candidateProfilevalues.formTemplateId= this.samplecandidateJson.formTemplateId;
    candidateProfilevalues.orgId= this.samplecandidateJson.orgId;
    candidateProfilevalues.name = this.candidateUapForm.get('name').value;
    candidateProfilevalues.emailId = this.candidateUapForm.get('emailId').value;
    candidateProfilevalues.phonenumber = this.candidateUapForm.get('phonenumber').value;
    candidateProfilevalues.degree = this.candidateUapForm.get('degree').value;
    candidateProfilevalues.specialization = this.candidateUapForm.get('specialization').value;
    candidateProfilevalues.alternateEmailId = this.candidateUapForm.get('alternateEmailId').value;
    candidateProfilevalues.gender = this.candidateUapForm.get('gender').value;
    candidateProfilevalues.resume = this.candidateUapForm.get('resume').value;
    if(this.candidateUapForm.get('experience')?.value != undefined && this.candidateUapForm.get('experience').value != ''){
      candidateProfilevalues.experience = this.candidateUapForm.get('experience').value * 1;
    }
    // dynamic array structure with education details 
    var educationArray = ["SSLC", "HSC", "UG", "PG", "PhD"];
    let educationDetails = [];
    for (var elem of educationArray) {
      if (this.candidateUapForm.get(elem).value != undefined && this.candidateUapForm.get(elem).value != null && this.candidateUapForm.get(elem).value !='') {
        educationDetails.push({
          gradeSystem:  this.candidateUapForm.get(elem).value > 10 ? "percentage" : "cgpa",
          percentage: this.candidateUapForm.get(elem).value,
          year_of_passing: this.candidateUapForm.get("yearOfPassing" + elem).value,
          level: elem
        })
        delete candidateProfilevalues[elem + 'Grading'];
        delete candidateProfilevalues[elem];
        delete candidateProfilevalues["yearOfPassing" + elem];
      } else {
        delete candidateProfilevalues[elem + 'Grading'];
        delete candidateProfilevalues[elem];
        delete candidateProfilevalues["yearOfPassing" + elem];
      }
    }
    if (educationDetails.length > 0) {
      educationDetails[educationDetails.length - 1].specialization = candidateProfilevalues['specialization'];
      educationDetails[educationDetails.length - 1].degree = candidateProfilevalues['degree'];
      educationDetails[educationDetails.length - 1].highestqualification = true;
    }
    candidateProfilevalues.educationDetails = educationDetails;
    candidateProfilevalues.resumeFileName = this.fileName;

    if (this.profileSync == 'candidateMyProfile') {
      candidateProfilevalues.updatedJson = true;
      this.api.updatedCandidateFormAPI(candidateProfilevalues).subscribe((res: any) => {
        if (res.success) {
          localStorage.setItem('details', JSON.stringify(candidateProfilevalues));
          this.dialog.closeAll();
          this.router.navigate(['/landing/assessment', sessionStorage.getItem("assessmentId")]);
          this.toast.success(res.message);
        } else {
          this.toast.error(res.message);
        }
      });
    } else {
      this.api.candidateProfile(candidateProfilevalues).subscribe((res: any) => {
        if (res.success) {
          localStorage.removeItem('orgId');
          localStorage.removeItem('formtemplate');
          localStorage.removeItem('details');
          this.assessmentCode = localStorage.getItem('assessmentIdCode');
          localStorage.removeItem('assessmentIdCode');
          sessionStorage.setItem('assessmentId', this.assessmentCode);
          localStorage.setItem('check', 'false');
          if (this.assessmentCode) {
            this.dialog.closeAll();
            sessionStorage.removeItem('routeTo');
            this.store.dispatch(assessmentIDAction({ id: this.assessmentCode }));
            this.router.navigate(['/landing/assessment', this.assessmentCode]);
          } else {
            this.toast.error('Assessment Id not found');
          }
          this.toast.success(res.message);
        } else {
          this.toast.error(res.message);
        }
      });
    }
  }

  startTimer(time) {
    this.timeLeft = time;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
      }
    }, 1000);
  }

  onStateChange() {
    const stateobj = {
      country_id: 101
    };
    this.api.stateList(stateobj).subscribe((res: any) => {
      if (res.success) {
        this.states = res.data;
      } else {
        this.toast.error(res.message);
      }
    });
  }

  onDistrictChange(id) {
    const districtobj = {
      state_id: id
    };
    this.api.districtList(districtobj).subscribe((res: any) => {
      if (res.success) {
        this.districts = res.data;
        this.colleges = [];
        this.onCollegeChange(this.samplecandidateJson.district)

      } else {
        this.toast.error(res.message);
      }
    });
  }

  onCollegeChange(value) {
    const collegeobj = {
      state_id: this.candidateUapForm.get('state').value,
      district_id: value
    };
    this.api.collegeList(collegeobj).subscribe((res: any) => {
      if (res.success) {
        // res.data.push({college_id: 0, college_name: "Others"})
        this.colleges = res.data;
      }
    });
  }

  onGradingChange(value, key) {
    if (this.displayFormField[key].mandatory) {
      if (value == "cgpa") {
        this.candidateUapForm?.get(key).setValidators([Validators.required,
        Validators.min(0),
        Validators.max(10)
        ]);
      } else {
        this.candidateUapForm?.get(key).setValidators([Validators.required,
        Validators.min(11),
        Validators.max(100)
        ]);
      }
        this.candidateUapForm.controls[key].patchValue(
          null
        );
        this.candidateUapForm.controls["yearOfPassing"+key].patchValue(
          null
        );
        this.candidateUapForm.controls[key].markAsUntouched();
        this.candidateUapForm.controls[key].updateValueAndValidity();
        this.candidateUapForm.controls["yearOfPassing"+key].markAsUntouched();
        this.candidateUapForm.controls["yearOfPassing"+key].updateValueAndValidity();
      // this.candidateUapForm.get(key).updateValueAndValidity();
    }
  }

  onDegreeSelect(value) {
    let obj = [];
    for (var elem in this.fieldsToshow) {
      if (this.fieldsToshow[elem].degree.includes(value)) {
        obj = this.fieldsToshow[elem].fields;
        break;
      }
    }
    let formField = {};
    for (var elem in this.tempFormField) {

      if (obj.includes(elem)) {
        formField[elem] = this.tempFormField[elem];
        if (elem == "SSLC" || elem == "HSC" || elem == "UG" || elem == "PG" || elem == "PhD") {
          for (var elem1 of this.tempFormField[elem].subtype) {
            this.candidateUapForm.controls[elem1.key].clearValidators();
            if (elem1.type == "cgpa") {
              if(this.candidateUapForm.get(elem + 'Grading').value == "cgpa"){
                this.candidateUapForm.controls[elem1.key].setValidators([Validators.required, Validators.min(0), Validators.max(10)]);
              }else{
                this.candidateUapForm.controls[elem1.key].setValidators([Validators.required, Validators.min(11), Validators.max(100)]);
              }
            } else {
              this.candidateUapForm.controls[elem1.key].setValidators([Validators.required]);
            }  
            this.candidateUapForm.controls[elem1.key].markAsUntouched();
            this.candidateUapForm.controls[elem1.key].updateValueAndValidity();
          }
        }
      } else {
        if (elem == "SSLC" || elem == "HSC" || elem == "UG" || elem == "PG" || elem == "PhD") {
          if (this.tempFormField[elem].type != undefined && this.tempFormField[elem].type == "array") {
            for (var elem1 of this.tempFormField[elem].subtype) {
              this.candidateUapForm.controls[elem1.key].clearValidators();
              this.candidateUapForm.controls[elem1.key].setValidators(null);
              this.candidateUapForm.controls[elem1.key].markAsUntouched();
              this.candidateUapForm.controls[elem1.key].updateValueAndValidity();
              this.candidateUapForm.controls[elem1.key].patchValue(
                null
              );
            }
          } else {
            this.candidateUapForm.controls[elem].clearValidators();
            this.candidateUapForm.controls[elem].setValidators(null);
            this.candidateUapForm.controls[elem].markAsUntouched();
            this.candidateUapForm.controls[elem].updateValueAndValidity();
            this.candidateUapForm.controls[elem].patchValue(
              null
            );
          }
        }
      }
    }

    this.displayFormField = formField;
  }

  onAlternateEmailChange() {

    if(this.candidateUapForm.get('alternateEmailId').value.length == 1 ) {
      this.candidateUapForm.controls['alternateEmailId'].clearValidators();
      this.candidateUapForm.controls['alternateEmailId'].setValidators([ Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]);
      this.candidateUapForm.controls['alternateEmailId'].markAsUntouched();
      this.candidateUapForm.controls['alternateEmailId'].updateValueAndValidity();
    }else if(this.candidateUapForm.get('alternateEmailId').value.length == 0){
      this.candidateUapForm.controls['alternateEmailId'].clearValidators();
      this.candidateUapForm.controls['alternateEmailId'].setValidators(null);
      this.candidateUapForm.controls['alternateEmailId'].markAsUntouched();
      this.candidateUapForm.controls['alternateEmailId'].updateValueAndValidity();
      this.candidateUapForm.controls['alternateEmailId'].patchValue(
        null
      );
    }
  }

  onYearSelect(value,previousCheck,currentCheck){
      var currentYear = moment(value).year();
      var previousYear = moment(this.candidateUapForm.get('yearOfPassing'+previousCheck).value).year()  
      if(previousCheck == "SSLC"){
        if(currentYear.toString().length == 4 && (currentYear - previousYear) <2){
          this.toast.error('Please choose the correct '+currentCheck+' year');
          this.yearValidation= this.yearValidation +1;
        }
      }else if(previousCheck == "HSC"){
        if(currentYear.toString().length == 4 && (currentYear - previousYear) <3){
          this.toast.error('Please choose the correct '+currentCheck+' year');
          this.yearValidation= this.yearValidation +1;
        }
      }else if(previousCheck == "UG"){
         var degree = this.candidateUapForm.get('degree').value;
         if(degree == "Dual"){
          var previousYear = moment(this.candidateUapForm.get('yearOfPassingHSC').value).year()  
          if(currentYear.toString().length == 4 && (currentYear - previousYear) <4){
            this.toast.error('Please choose the correct '+currentCheck+' year');
            this.yearValidation= this.yearValidation +1;
          }
         }else{
          if(currentYear.toString().length == 4 && (currentYear - previousYear) <2){
            this.toast.error('Please choose the correct '+currentCheck+' year');
            this.yearValidation= this.yearValidation +1;
          }
         }
        
      }else if(previousCheck == "PG"){
        if(currentYear.toString().length == 4 && (currentYear - previousYear) <3){
          this.toast.error('Please choose the correct '+currentCheck+' year');
          this.yearValidation= this.yearValidation +1;
        }
      }
  }

  chosenYearHandler(normalizedYear: any, dp: any, key) {
    const ctrlValue = moment(normalizedYear);
    this.candidateUapForm.controls['yearOfPassing' + key].setValue(
      ctrlValue
    );
    dp.close();
  }

  getSpecialization(){
    this.api.getSpecializationApi({}).subscribe((data:any)=>{
      if(data.success){
        this.specializationArray = data.data[0].specializationList;
      }else{
        this.specializationArray = [];
      }
    });
  }

  getDegree(id){
    this.api.getDegreeApi({template:id}).subscribe((data:any)=>{
      if(data.success){
        this.degreeArray = data.data[0].degree;
      }else{
        this.degreeArray = [];
      }
    });
  }

  navigateToTestCard() {
    this.router.navigate(['/landing/assessment', sessionStorage.getItem("assessmentId")]);
  }

  socketProgres() {
    //for single login
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
