import { FormGroup, FormControl } from '@angular/forms';

export function emailValidator(control: FormControl): { [key: string]: any } {
  const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  return {
    invalidEmail: control.value && !emailRegexp.test(control.value),
  };
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
  return (group: FormGroup) => {
    const password = group.controls[passwordKey];
    const passwordConfirmation = group.controls[passwordConfirmationKey];
    return passwordConfirmation.setErrors({
      mismatchedPasswords: password.value !== passwordConfirmation.value,
    });
  };
}
