import { Injectable } from '@angular/core';
import { Register } from './register.model';
import { AlertService } from '../alert/alert.service';
import { DECK, ROUTE } from '../shared/shared.constants';
import axios from '../auth/axios/axios';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(
    private readonly router: Router,
    private readonly alertService: AlertService
  ) {}

  public async register(registerData: Register) {
    const { email, password, password2 } = registerData;
    if (email.trim() === '')
      return this.alertService.setAlert('Email cannot be empty');

    if (password.trim() === '')
      return this.alertService.setAlert('Password cannot be empty');

    if (password.length < DECK.DECK_MIN_LENGTH)
      return this.alertService.setAlert(
        `Password is must be at least ${DECK.DECK_MIN_LENGTH} character`
      );

    if (password.trim() !== password2.trim())
      return this.alertService.setAlert('Passwords do not match');

    try {
      const response = await axios({
        url: '/register',
        method: 'post',
        data: { email, password },
      });

      if (response?.status == 201)
        this.router.navigate([`${ROUTE.ROUTE_PREFIX}/login`]);
      this.alertService.setAlert('Successfully Registered', 'success');
    } catch (err) {
      this.alertService.handleError(err);
    }
  }
}
