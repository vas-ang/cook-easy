import { AbstractControl } from '@angular/forms';

export function rePasswordMatchFactory(password: AbstractControl) {
  return function rePasswordMatch(rePassword: AbstractControl) {
    const isMatch = password.value === rePassword.value;

    return isMatch ? null : { rePasswordMatch: true };
  };
}
