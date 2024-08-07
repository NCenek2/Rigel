import axios from './axios/axios';
import { LoginInfo } from '../login/login.model';
import { ROUTE } from '../shared/shared.constants';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { Token } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly alertService: AlertService
  ) {}

  private _auth: Token | null = null;

  from =
    this.route.snapshot.queryParams['from'] || `${ROUTE.ROUTE_PREFIX}/modes`;

  public logout() {
    this._auth = null;
    this.router.navigate(['/login']);
  }

  async login(loginInfo: LoginInfo) {
    try {
      const response = await axios({
        url: '/auth/login',
        method: 'post',
        data: loginInfo,
      });
      if (response?.status === 200) {
        const auth: Token = response.data;

        this._auth = auth;
        this.router.navigate(['/modes'], {
          replaceUrl: true,
          state: { from: this.from },
        });
      }
    } catch (err) {
      this.alertService.handleError(err);
    }
  }

  public isAuthenticated() {
    return this._auth;
  }
}
