import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ModesComponent } from './modes/modes.component';
import { modesRoutes } from './modes/modes.routes';
import { resolveCards } from './modes/edit/card/card.resolver';
import { isAuthorized } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    title: 'Home Page',
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    title: 'Login Page',
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterComponent,
    title: 'Register Page',
  },
  {
    path: 'modes',
    component: ModesComponent,
    children: modesRoutes,
    runGuardsAndResolvers: 'always',
    canMatch: [isAuthorized],
    resolve: {
      cards: resolveCards,
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found Page',
  },
];
