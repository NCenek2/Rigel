import { Component } from '@angular/core';
import { Alert } from './alert.model';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  constructor(private readonly alertService: AlertService) {}

  get alertType() {
    return this.alertService.alertType;
  }

  get alert() {
    return this.alertService.alert;
  }

  get isAlertActive() {
    return this.alertService.isAlertActive;
  }

  hideAlert() {
    this.alertService.hideAlert();
  }
}
