import { Routes } from '@angular/router';
import {LoginComponent} from './user/login/login.component';
import {AuthGuardService} from './core/services/auth-guard.service';
import {TeamComponent} from './team/team.component';
import {LogoutComponent} from './user/logout/logout.component';
import {GameComponent} from './game/game.component';

export const routes: Routes = [
  { path: '', redirectTo: 'teams', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuardService] },
  { path: 'teams', component: TeamComponent, canActivate: [AuthGuardService] },
  { path: 'games', component: GameComponent, canActivate: [AuthGuardService] },
];
