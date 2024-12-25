import { Routes } from '@angular/router';
import {LoginComponent} from './user/login/login.component';
import {AppComponent} from './app.component';
import {AuthGuardService} from './core/services/auth-guard.service';
import {TeamComponent} from './team/team.component';
import {LogoutComponent} from './user/logout/logout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'teams', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuardService] },
  { path: 'teams', component: TeamComponent, canActivate: [AuthGuardService] },
];
