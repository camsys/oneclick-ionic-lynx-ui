import { FormControl } from '@angular/forms';

export class EmailAddressValidator {

  static isValid(control: FormControl): any {
    if(! control.value.includes('@'))
    {
      return {
        "Must contain an @ sign": true
      };
    }

    return null;
  }
}
