import {Component} from '@angular/core';
import {LoggerService} from '../../core/services/logger.service';
import {ChangePasswordRequest} from './change-password-request.model';
import {UserService} from '../../core/services/user.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MustMatch} from '../../shared/validators/must-match.validator';
import {Location, NgIf} from '@angular/common';
import {MatCard} from '@angular/material/card';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatLabel} from '@angular/material/form-field';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatError,
    MatInput,
    MatButton,
    MatLabel,
    NgIf
  ],
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  changePasswordRequest: ChangePasswordRequest = {
    oldPassword: '',
    newPassword: '',
  };

  changePasswordForm: FormGroup;

  submitted: boolean = false;

  constructor(private logger: LoggerService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private location: Location) {

    this.changePasswordForm = this.formBuilder.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      });

  }

  // Easy access to form fields
  get formFields() { return this.changePasswordForm.controls; }

  changePassword() {
    this.logger.log('Changing password');
    this.changePasswordRequest = {
      oldPassword: this.formFields['oldPassword'].value,
      newPassword: this.formFields['newPassword'].value
    };
    this.userService.changePassword(this.changePasswordRequest);
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      this.logger.log('Invalid form!');
      return;
    }
    this.changePassword();
    this.location.back();
  }

  cancel() {
    this.location.back();
  }

}
