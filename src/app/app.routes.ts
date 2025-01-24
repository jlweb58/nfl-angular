import { Routes } from '@angular/router';
import {LoginComponent} from './user/login/login.component';
import {AuthGuardService} from './core/services/auth-guard.service';
import {TeamComponent} from './team/team.component';
import {LogoutComponent} from './user/logout/logout.component';
import {GameComponent} from './game/game.component';
import {ChangePasswordComponent} from './user/change-password/change-password.component';
import {ManagePicksComponent} from './user/picks/manage-picks.component';
import {RegisterComponent} from './user/register/register.component';
import {AdminComponent} from './admin/admin.component';
import {PoolComponent} from './pool/pool.component';
import {PoolTableComponent} from './pool/pool-table/pool-table.component';
import {UserManagementComponent} from './admin/user-management/user-management.component';
import {UserEditComponent} from './admin/user-edit/user-edit.component';
import {DatetimeEditComponent} from './admin/datetime-edit/datetime-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: 'teams', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuardService] },
  { path: 'teams', component: TeamComponent, canActivate: [AuthGuardService] },
  { path: 'games', component: GameComponent, canActivate: [AuthGuardService] },
  { path: 'changePassword', component: ChangePasswordComponent, canActivate: [AuthGuardService] },
  { path: 'picks', component: ManagePicksComponent, canActivate: [AuthGuardService] },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardService], data: {roles: ['ADMIN']} },
  { path: 'pools', component: PoolComponent, canActivate: [AuthGuardService], data: {roles: ['ADMIN']} },
  { path: 'pool-table', component: PoolTableComponent, canActivate: [AuthGuardService] },
  { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuardService] },
  { path: 'users/:id/edit', component: UserEditComponent },
  { path: 'date-time-edit', component: DatetimeEditComponent },
];
