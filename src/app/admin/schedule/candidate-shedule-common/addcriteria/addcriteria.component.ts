import { Component, OnInit, } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScheduleAPIService } from 'src/app/rest-api/schedule-api/schedule-api.service';
import { SentData } from 'src/app/rest-api/sendData';
import { UserAPIService } from 'src/app/rest-api/user-api/user-api.service';

@Component({
  selector: 'uap-addcriteria',
  templateUrl: './addcriteria.component.html',
  styleUrls: ['./addcriteria.component.scss']
})
export class AddcriteriaComponent implements OnInit {
  CriteriaDetailsForm: FormGroup
  // Form Variables
  form_criteriaArray = 'criteriaDet';
  criteria = 'criteria';
  criteriaId = 'criteriaId';
  condtiton = 'condtiton';
  percentage = 'percentage';
  successMsg = 'successMsg';
  failureMsg = 'failureMsg';
  testDetails: any;
  getAlldata: any;
  criteriaList: any;
  changeText: boolean = true;
  criteriaData: any;
  CriteriaDetails: any;
  addressObject: any;
  setArraylength: any;
  newId: any;
  getnewId: any;
  creteriaformvalues: any;
  isreadonly: any;
  successMessage: any;
  successstaticmsg: any;
  FailureMessageflag: boolean = false;
  myValue: any;
  myValuename: any;
  myValuecondition: any;
  typevaluetextone: any;
  constructor(
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService,
    private toaster: ToastrService,
    private scheduleService: ScheduleAPIService,
    private matDialog: MatDialog,
    private sendData: SentData,
    private userService: UserAPIService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getCriterianame(this.data);
    this.formInitialize();
    this.isReadonlyInput();

    if (this.data && this.data.key == '0') {
      this.getTestDetails(this.data?.type);
    }
    else {
      let index = this.data.index
      if (this.data && this.data.key == '1') {
        this.getTestDetails(this.data?.type);
      }

    }
    this.successstaticmsg = this.data.successMessage
  }

  isReadonlyInput() {
    if (this.data.status == 'InProgress') {
      this.isreadonly = true;
    }
    else {
      this.isreadonly = false
    }
  }

  formInitialize() {
    this.CriteriaDetailsForm = this.fb.group({
      [this.successMsg]: [this.data && this.data.successMessage, [Validators.required, Validators.maxLength(255)]],
      [this.failureMsg]: [null, [Validators.maxLength(255)]],
      [this.form_criteriaArray]: this.fb.array([]),
    })
  }


  initcriteriaArray() {
    return this.fb.group({
      [this.criteria]: [null, [Validators.required]],
      [this.criteriaId]: [null],
      [this.condtiton]: [null, [Validators.required]],
      [this.percentage]: [null, [this.glovbal_validators.percentageNew(), this.glovbal_validators.numberOnly(), Validators.maxLength(5), Validators.required]]
    })

  }

  getCriterianame(data) {
    let val = {
      type: data && data.dataKey && data.dataKey.type ? data.dataKey.type : data.dataKey.value.type
    }
    this.scheduleService.getCriteria(val).subscribe((response: any) => {
      if (response.success) {
        this.criteriaList = response.data;
      }
      else {
        this.toaster.error(response.message);
      }
    });
  }

  getTestDetails(type) {
    if (type == "add") {
      this.FailureMessageflag = false;
    } else if (type == "view") {
      this.FailureMessageflag = true;
    }
    else if (type == "edits") {
      this.FailureMessageflag = false;
    }
    else if (type == "editView") {
      this.FailureMessageflag = true;

    } else if (type == "editViewInProgress" && this.data.dataKey.criteriaDet[0].criteriaDet[0]) {
      this.FailureMessageflag = true;
    }

    this.getAlldata = this.data;
    setTimeout(() => {
      if (this.getAlldata && this.getAlldata.form) {
        this.patchCriteria(this.getAlldata.form, this.getAlldata.index)
      }
    }, 100);
    this.testDetails = this.data && this.data.dataKey ? this.data.dataKey.value : '';
  }


  patchCriteria(data, index) {
    let criteriaDetails = data[index].value.criteriaDet;
    if (criteriaDetails && criteriaDetails.length > 0) {
      this.getcerteriaArr.clear();
      this.CriteriaDetailsForm.patchValue({
        successMsg: criteriaDetails[criteriaDetails.length - 1].successMsg != undefined
          && criteriaDetails[criteriaDetails.length - 1].successMsg != null &&
          criteriaDetails[criteriaDetails.length - 1].successMsg != '' ?
          criteriaDetails[criteriaDetails.length - 1].successMsg : this.getAlldata.successMessage
      })
      this.CriteriaDetailsForm.patchValue({ failureMsg: criteriaDetails[criteriaDetails.length - 1].failureMsg })
      criteriaDetails[criteriaDetails.length - 1].criteriaDet.forEach(element => {
        this.getcerteriaArr.push(this.ifCriteriaDetails(element))
      })
    }
  }

  ifCriteriaDetails(data) {
    return this.fb.group({
      [this.criteria]: [data.criteria, [Validators.required]],
      [this.criteriaId]: [data ? data.criteriaId : ''],
      [this.condtiton]: [data.condtiton, [Validators.required]],
      [this.percentage]: [this.data.status == 'InProgress' ? { value: parseInt(data.percentage), disabled: true } : parseInt(data.percentage), [this.glovbal_validators.percentageNew(), Validators.maxLength(5), Validators.required]]
    })
  }


  editPatchvalue(data, index) {
    let editpatchcriteria = data.form[index].value.criteriaDet[0];
    this.CriteriaDetailsForm.patchValue({ successMsg: editpatchcriteria[editpatchcriteria.length - 1].successMsg ? editpatchcriteria[editpatchcriteria.length - 1].successMsg : this.data.successMessage })
    this.CriteriaDetailsForm.patchValue({ failureMsg: editpatchcriteria[editpatchcriteria.length - 1].failureMsg })
    editpatchcriteria[editpatchcriteria.length - 1].criteriaDet.forEach(element => {
      this.getcerteriaArr.push(this.ifCriteriaDetails(element))
    })
  }

  formSubmit() {
    let arr: any = [];
    // checking multiple criteria name
    let criteriaArr = this.CriteriaDetailsForm.value && this.CriteriaDetailsForm.value.criteriaDet;
    criteriaArr.forEach(element => {
      arr.push(element.criteria)
    });
    let hasDuplicates = arr => new Set(arr).size != arr.length
    const duplicate = hasDuplicates(arr)

    if (!duplicate) {
      let data: any = {
        criteriaFormValue: this.CriteriaDetailsForm.value,
        index: this.getAlldata ? this.getAlldata.index : this.data.index,
        item: this.data,
        editscheduleupdatebtn: true,
        event: 'critiria',
      }
      if (this.getcerteriaArr.controls.length >= 0) {
        this.sendData.sendMessage(data)
        this.matDialog.closeAll();
        this.toaster.success('Successfully completed')
      }
    } else {
      this.toaster.warning('Cannot add multiple criteria name for same test')
    }


  }
  addToCriteriaArray(event, data) {
    if (this.getcerteriaArr.controls.length >= 0) {
      if (this.getcerteriaArr.valid) {
        this.criteriaList.forEach(element => {
          if (event.criteriaName && element.criteriaName == "Overall Test Score") {
            element.flag = false;
          }
        })
        return this.getcerteriaArr.push(this.initcriteriaArray());
      }
    }
    this.glovbal_validators.validateAllFormArrays(this.CriteriaDetailsForm.get([this.form_criteriaArray]) as FormArray);
  }

  onInputChange(event) {
    if (this.getcerteriaArr.status == "VALID") {
      this.FailureMessageflag = true;
      this.CriteriaDetailsForm.controls.failureMsg.setValidators([Validators.required, Validators.maxLength(255)])
      this.CriteriaDetailsForm.controls.failureMsg.markAsUntouched();
      this.CriteriaDetailsForm.controls.failureMsg.updateValueAndValidity({ emitEvent: false });
    }
  }
  criteriaremoveDependentArray(i, controls) {
    this.getcerteriaArr.removeAt(i);
    if (controls.length == 0) {
      this.CriteriaDetailsForm.controls.failureMsg.setValue(null)
      this.CriteriaDetailsForm.controls.failureMsg.markAsUntouched();
      this.CriteriaDetailsForm.controls.failureMsg.updateValueAndValidity({ emitEvent: false });
      this.FailureMessageflag = false;
    } else {
      this.FailureMessageflag = true;
    }

  }
  changecriteria(event, data) {
    data.get(this.criteriaId).setValue(event._id)
  }


  getCriteriaSuccessMessage() {
    let data = {
      scheduleId: '000'
    }

    this.userService.getAssessmentTaskCriteria(data).subscribe((resData: any) => {
      if (resData.success) {
        this.successMessage = resData.data[0].successMsg;
      } else {

      }

    })
  }


  get getcerteriaArr() { return this.CriteriaDetailsForm.get([this.form_criteriaArray]) as FormArray; }

  get successmsg() {
    return this.CriteriaDetailsForm.get(this.successMsg);
  }

  get failuremsg() {
    return this.CriteriaDetailsForm.get(this.failureMsg);
  }
}
