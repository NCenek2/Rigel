import { inject } from '@angular/core';
import {
  CanMatchFn,
  RedirectCommand,
  Route,
  Router,
  UrlSegment,
} from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { AuthService } from './auth.service';

export const isAuthorized: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const alertService = inject(AlertService);
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    alertService.setAlert('Unauthorized');
    return new RedirectCommand(router.parseUrl('/login'));
  }

  return true;
};
