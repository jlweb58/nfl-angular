import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {TokenStorageService} from './core/services/token-storage.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbar,
    MatIcon,
    MatButton,
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  tokenStorageService: TokenStorageService;

  constructor(tokenStorageService: TokenStorageService) {
    this.tokenStorageService = tokenStorageService;
  }

}
