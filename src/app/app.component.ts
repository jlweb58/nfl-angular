import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {TokenStorageService} from './core/services/token-storage.service';
import {CommonModule} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {UserRole} from './user/user-role.model';
import {User} from './user/user.model';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbar,
    MatIcon,
    MatButton,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent  {

  constructor(protected tokenStorageService: TokenStorageService) {
  }

  isCurrentUserAdmin(): boolean {
    return this.tokenStorageService.getUserRoles().some((role) => role === UserRole.ADMIN);
  }

  getCurrentUser(): User | null {
    return this.tokenStorageService.getUser();
  }

}
