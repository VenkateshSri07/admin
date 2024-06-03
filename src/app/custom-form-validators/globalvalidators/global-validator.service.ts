import { Injectable } from '@angular/core';
import { ValidationErrors, ValidatorFn, AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GlobalValidatorService {


  constructor() { }
  // Custom regex validator
  regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const isWhitespace = (control.value.toString() || '').trim().length === 0;
      // Whitespace detect
      if (isWhitespace) {
        control.setValue(null);
        return error;
      } else {
        const valid = regex.test(control.value.toString().trim());
        return valid ? null : error;
      }
    };
  }


  /* ****************  Define all your regex validators below ************* */
  // Alpha numberic with ',' '.' are allowed, Maximum lenth allowed is 30 characters
  alphaNum50() {
    const alphaNumericwithCommonSpecialCharactersMaxLength30: RegExp = /^([a-zA-Z0-9_ \-,.\r\n]){0,50}$/;
    return this.regexValidator(alphaNumericwithCommonSpecialCharactersMaxLength30, { alphaNum50: true });
  }
  twoDigit() {
    const twoDigit: RegExp = /^.{1,2}$/;
    return this.regexValidator(twoDigit, { twoDigit: true });
  }
  threeDigit() {
    const threeDigit: RegExp = /^.{1,3}$/;
    return this.regexValidator(threeDigit, { threeDigit: true });
  }

  numericCharacter() {
    const numericCharacter: RegExp = /^\d+(\.\d+)?$/;
    return this.regexValidator(numericCharacter, { numericCharacter: true });
  }
  decimalPattern() {
    const decimalCharacter: RegExp = /^\d+(\.\d+)?$/;
    return this.regexValidator(decimalCharacter, { decimalCharacter: true });
  }

  whiteSpace() {
    const pattern: RegExp = /\s/;
    return this.regexValidator(pattern, { pattern: true });
  }


  schedulepattern() {
    const schedulepattern: RegExp = /^([a-zA-Z0-9 _ () \-\\@]){0,255}$/;
    return this.regexValidator(schedulepattern, { schedulepattern: true });
  }

  alphaNum255() {
    const alphaNumericwithCommonSpecialCharactersMaxLength30: RegExp = /^([a-zA-Z0-9_ \-,.'&\r\n]){0,255}$/;
    return this.regexValidator(alphaNumericwithCommonSpecialCharactersMaxLength30, { alphaNum255: true });
  }

  alphaNum100() {
    const alphaNumericwithCommonSpecialCharactersMaxLength30: RegExp = /^([a-zA-Z0-9_ \-,.\r\n]){0,100}$/;
    return this.regexValidator(alphaNumericwithCommonSpecialCharactersMaxLength30, { alphaNum100: true });
  }

  address255() {
    const address255: RegExp = /^([a-zA-Z0-9_ \-,.:/\r\n|\r|\n/]){0,255}$/;
    return this.regexValidator(address255, { address255: true });
  }

  skills255() {
    const skills255: RegExp = /^([a-zA-Z0-9_ \-,.:+#*&/\r\n|\r|\n/]){0,255}$/;
    return this.regexValidator(skills255, { skills255: true });
  }

  offer() {
    const offer: RegExp = /^([a-zA-Z0-9_ \-,.:&/\r\n|\r|\n/]){0,255}$/;
    return this.regexValidator(offer, { offer: true });
  }

  address50() {
    const address50: RegExp = /^([a-zA-Z0-9_ \-,.:/\r\n|\r|\n/]){0,49}$/;
    return this.regexValidator(address50, { address50: true });
  }

  // Email pattern regex
  email() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return this.regexValidator(emailregex, { email: true });
  }
  passwordRegex() {
    const passwordHard: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.\(\)\{\}\[\]\:\;\<\>\,\?\/\\\~\_\+\-\=\|])(?=.{0,})/gm;
    return this.regexValidator(passwordHard, { password: true });
  }

  mobileRegex() {
    const mobileRegex: RegExp = /^[6-9][0-9]{9}$/;
    return this.regexValidator(mobileRegex, { mobileRegex: true });
  }

  textOnlyRegex() {
    const textRegex: RegExp = /^[a-zA-Z \n]{0,255}$/;
    return this.regexValidator(textRegex, { textRegex: true });
  }

  numberOnly() {
    const numberOnly: RegExp = /^[0-9]*$/;
    return this.regexValidator(numberOnly, { numberOnly: true });
  }

  zipOnly() {
    const zipOnly: RegExp = /^[0-9]{6}$/;
    return this.regexValidator(zipOnly, { zipOnly: true });
  }

  alphaNum10() {
    const alphaNum10: RegExp = /^([a-zA-Z0-9_ ]){0,10}$/;
    return this.regexValidator(alphaNum10, { alphaNum10: true });
  }

  panNo() {
    const panNo: RegExp = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    return this.regexValidator(panNo, { panNo: true });
  }

  numberDecimals() {
    const numberDecimals: RegExp = /^\d*(\.\d{0,2})?$/;
    return this.regexValidator(numberDecimals, { numberDecimals: true });
  }

  CGPA() {
    const CGPA: RegExp = /^\d*(\.\d{0,1})?$/;
    return this.regexValidator(CGPA, { CGPA: true });
  }

  eyenumberDecimals() {
    const eyenumberDecimals: RegExp = /^[\-\+]?[0-9]{1,2}\d*(\.\d{0,2})?$/;
    return this.regexValidator(eyenumberDecimals, { eyenumberDecimals: true });
  }

  bloodGroup() {
    const bloodGroup: RegExp = /^[\-\+]?[a-zA-Z0-9_ ]{1,2}\d*(\.\d{0,2})?$/;
    return this.regexValidator(bloodGroup, { bloodGroup: true });
  }

  aadhaar() {
    const aadhaar: RegExp = /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/;
    return this.regexValidator(aadhaar, { aadhaar: true });
  }

  backlog() {
    const backlog: RegExp = /^[0-9][0-9]{0,1}$/;
    return this.regexValidator(backlog, { backlog: true });
  }

  percentage() {
    const percentage = /(^100(\.0{1,2})?$)|(^(?:[2-9]\d|\d{2}?)(\.[0-9]{1,2})?$)/;
    return this.regexValidator(percentage, { percentage: true });
  }

  percentage35() {
    const percentage35 = /(^100(\.0{2,3})?$)|(^(?:[2-34]\d|\d{2}?)(\.[0-9]{1,2})?$)/;
    return this.regexValidator(percentage35, { percentage35: true });
  }

  checkURL() {
    const checkURL = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return this.regexValidator(checkURL, { checkURL: true });
  }

  alphaWithDots() {
    const alphaWithDots = /^([a-zA-Z0-9_ \-,.@&*(:)\r\n])*$/;
    return this.regexValidator(alphaWithDots, { alphaWithDots: true });
  }

  // To validate all fields after submit
  validateAllFormArrays(formArray: FormArray) {
    formArray.controls.forEach(formGroup => {
      Object.keys(formGroup['controls']).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFields(control);
        }
      });

    });
  }

  // To validate all fields in the form group
  validateAllFields(formGroup: FormGroup) {
    return Object.keys(formGroup.controls).forEach(field => {
      // formGroup.get(field).setValue(formGroup.get(field).value ? formGroup.get(field).value.trim() : formGroup.get(field).value); // This line of code will trim the whitespaces before and after before validate
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  percentageNew(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const isWhitespace = (control.value.toString() || '').trim().length === 0;
      // Whitespace detect
      if (isWhitespace) {
        control.setValue(null);
        return { percentage: true };
      } else {
        var x = parseInt(control.value);
        if (isNaN(x) || x < 1 || x > 100) {
          // value is out of range
          return { percentage: true };
        } else {
          return null;
        }
      }
    };
  }
}

