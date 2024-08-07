import { Component, inject } from '@angular/core';
import { PASSWORD } from '../shared/shared.constants';
import { AuthService } from '../auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  alertService = inject(AlertService);
  form = new FormGroup({
    email: new FormControl<string>('', { validators: [Validators.required] }),
    password: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(PASSWORD.PASSWORD_MIN_LENGTH),
      ],
    }),
  });

  constructor(private readonly authService: AuthService) {}

  onSubmit() {
    const { email, password } = this.form.value;
    if (!email || !password) {
      return this.alertService.setAlert('Email or password is empty.');
    }

    this.authService.login({ email, password });
  }
}
