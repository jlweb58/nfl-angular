import { Routes } from '@angular/router';
import {LoginComponent} from './user/login/login.component';
import {AppComponent} from './app.component';
import {AuthGuardService} from './core/services/auth-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: AppComponent, canActivate: [AuthGuardService] },
];
