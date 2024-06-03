import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SentData } from 'src/app/rest-api/sendData';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'uap-instruction-schedule',
  templateUrl: './instruction-schedule.component.html',
  styleUrls: ['./instruction-schedule.component.scss']
})
export class InstructionScheduleComponent implements OnInit {
  htmlContent: any = '';
  isBtnDisbaled: boolean = true;
  isConfirmbtnchange: any;
  getInstructionvalue: any;
  addhtmlValue: any;
  form: FormGroup = new FormGroup({
    instruction: new FormControl('')
  });

  editorDisabled = false;
  editBtnEnable = false;
  config1 = {
    airMode: false,
    tabDisable: true,
    placeholder: 'Enter text here...',
    tabsize: 1,
    height: '260px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      // ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontsize', 'color']],
      ['para', ['ul', 'ol', 'paragraph']],
      // ['insert', ['table', 'picture', 'link', 'video', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewFilter: true,
  }

  constructor(
    private matDialog: MatDialog,
    private sendData: SentData,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.addhtmlValue = sessionStorage.getItem("InstructionValue") ? sessionStorage.getItem("InstructionValue") : this.data?.instruction;
    this.form.get('instruction').setValue(this.addhtmlValue)
    this.editBtnEnable = this.form.get('instruction').value ? true : false;
    this.editorDisabled = this.editBtnEnable;
  }

  cancel() {
    let data = {
      isBtnDisbaled: this.isBtnDisbaled,
    }
  }

  InstructionSubmitted() {
    let data = {
      isBtnDisbaled: this.isBtnDisbaled,
      addhtmlValue: this.form.get('instruction').value,
      event: 'instrution',
    }
    sessionStorage.setItem("InstructionValue", this.form.get('instruction').value);
    this.sendData.sendMessage(data)
    this.matDialog.closeAll();
    if (this.form.get('instruction').value) {
      this.sendData.success("General instructions added successfully");
    } else {
      this.sendData.success("General instructions updated successfully");
    }
    this.addhtmlValue = sessionStorage.getItem("InstructionValue") ? sessionStorage.getItem("InstructionValue") : '';
  }

  edit() {
    this.editBtnEnable = false;
    this.editorDisabled = false;
  }

  change(val) {
    if (val) {
      var InstructionVal = val.replace(/<[^>]*>/g, '');
      if (InstructionVal.trim() == '' && InstructionVal.trim() == "") {
        this.form.get('instruction').setValue('')
      }
    }
  }

  paste() { }
}
