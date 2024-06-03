import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'uap-verificationcode',
  templateUrl: './verificationcode.component.html',
  styleUrls: ['./verificationcode.component.scss']
})
export class VerificationcodeComponent implements OnInit {
  verifyForm: FormGroup;
  constructor(public fb: FormBuilder) {}


  ngOnInit(): void {

  }
  instalizationForm() {
    this.verifyForm = this.fb.group({
      verifycationCodeNumber: ['', Validators.required]
    });
  }


}
