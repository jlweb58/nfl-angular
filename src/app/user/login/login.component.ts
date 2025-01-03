import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../core/services/authentication.service';
import {TokenStorageService} from '../../core/services/token-storage.service';
import {MatDividerModule} from '@angular/material/divider';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {LoggerService} from '../../core/services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [MatDividerModule, FormsModule, MatFormFieldModule, CommonModule, MatInputModule, MatButton]
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  isLoggedIn: boolean = false;
  isError: boolean = false;
  roles: string[] = [];

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private tokenStorageService: TokenStorageService,
              private logger: LoggerService) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      this.isError = false;
      this.roles = this.tokenStorageService.getUser()!.roles;
    }
  }

  checkLogin(): void {
    this.authenticationService.authenticate(this.username, this.password).subscribe(jwtResponse => {
       this.tokenStorageService.saveToken(jwtResponse.accessToken);
       this.tokenStorageService.saveUser(jwtResponse);
       this.isLoggedIn = true;
       this.isError = false;
       this.roles = this.tokenStorageService.getUser()!.roles;
       this.router.navigate(['']);
      },
      error => {
        this.logger.log('Error happened on login');
        this.isLoggedIn = false;
        this.isError = true;
      }
    );
  }

}
