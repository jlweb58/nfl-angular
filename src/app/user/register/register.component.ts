import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoggerService} from '../../core/services/logger.service';
import {UserService} from '../../core/services/user.service';
import {MustMatch} from '../../shared/validators/must-match.validator';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {FeedbackDialog} from '../../core/components/feedback-dialog.component';
import {MatOption, MatSelect} from '@angular/material/select';
import {Pool} from '../../core/models/pool.model';
import {PoolService} from '../../core/services/pool.service';

@Component({
  selector: 'app-register',
  imports: [
    MatButton,
    MatCard,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatSelect,
    MatOption,
    NgForOf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerUserForm: FormGroup;

  submitted: boolean = false;

  pools: Pool[] = [];

  constructor(private formBuilder: FormBuilder, private logger: LoggerService,
              private userService: UserService, private router: Router,
              private dialog: MatDialog, private poolService: PoolService) {
    this.registerUserForm = this.formBuilder.group({
        name: new FormControl('',),
        username: new FormControl('', [Validators.required]),
        pool: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

  ngOnInit(): void {
    this.poolService.getPools().subscribe(
      results => {
        if (!results) {
          return;
        }
        this.pools = results;
      }
    );

    }

  get formFields() {
    return this.registerUserForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.logger.log('Submitted');
    if (this.registerUserForm.invalid) {
      this.logger.log('Invalid registration form');
      return;
    }
    this.registerUser();
  }

  private registerUser() {
    let registerUserRequest = {
      name: this.formFields['name'].value,
      username: this.formFields['username'].value,
      password: this.formFields['password'].value,
      poolId: this.formFields['pool'].value,
    }
    this.userService.registerUser(registerUserRequest).subscribe({
        next: (response) => {
          this.dialog.open(FeedbackDialog, {
            data: {
              title: 'Registration Succeeded',
              message: 'User was successfully registered!',
            }, panelClass: 'custom-dialog-container',
          }).afterClosed().subscribe(() => {
            this.router.navigate(['/registered']);
          });
        },
        error: (error) => {
          this.dialog.open(FeedbackDialog, {
            data: {
              title: 'Registration failed',
              message: 'User could not be registered because ' + error.message,
            },  panelClass: 'custom-dialog-container',

        });
          this.logger.log('Error while registering user ' + error.message);
        }
      }
    );
  }

}
