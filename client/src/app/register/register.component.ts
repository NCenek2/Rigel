import { Component, inject } from '@angular/core';
import { EMAIL, PASSWORD } from '../shared/shared.constants';
import { RegisterService } from './register.service';
import { Register } from './register.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(EMAIL.EMAIL_MAX_LENGTH),
      ],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(PASSWORD.PASSWORD_MIN_LENGTH),
          ],
        }),
        password2: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(PASSWORD.PASSWORD_MIN_LENGTH),
          ],
        }),
      },
      {
        validators: [],
      }
    ),
  });

  registerService = inject(RegisterService);

  onSubmit() {
    const { email, passwords } = this.form.value;
    if (!email || !passwords) return;

    const { password, password2 } = passwords;
    if (!password || !password2) return;

    if (this.form.invalid) return;

    const registerData: Register = {
      email,
      password,
      password2,
    };

    this.registerService.register(registerData);
  }
}
