import { Injectable } from '@angular/core';
import { Alert } from './alert.model';
// import { AuthService } from '../auth/auth.service';

type ReturnError = {
  message: string;
  statusCode: number;
};

@Injectable({ providedIn: 'root' })
export class AlertService {
  alertType: Alert = 'danger';
  alert = '';
  isAlertActive = false;
  timeout: ReturnType<typeof setTimeout> | null = null;

  // constructor(private readonly authService: AuthService) {}

  setAlert(alertMessage: string, alertType: Alert = 'danger') {
    this.alert = alertMessage;
    this.alertType = alertType;
    this.isAlertActive = true;
    this.timeout = setTimeout(() => this.hideAlert(), 4000);
  }

  hideAlert() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.alert = '';
    this.isAlertActive = false;
  }

  handleError(err: any): ReturnError {
    let message = 'Error';
    let statusCode = 500;

    if (err?.response?.data?.message) {
      message = err.response.data.message;
      if (Array.isArray(message) && message.length > 0) {
        message = message[0];
      }
      statusCode = err?.response?.data?.statusCode;
    } else if (err?.response?.status) {
      message = err?.response?.statusText;
      statusCode = err.response.status;
    } else {
      message = err?.message;
      statusCode = err?.status;
    }

    message ??= 'Error';
    statusCode ??= 500;

    this.setAlert(message);
    // if (statusCode === 403) this.authService.logout();
    return { message, statusCode };
  }
}
