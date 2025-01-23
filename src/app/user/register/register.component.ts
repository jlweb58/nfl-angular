import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgForOf, NgIf} from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  Validators
} from '@angular/forms';
import {LoggerService} from '../../core/services/logger.service';
import {UserService} from '../../core/services/user.service';
import {MustMatch} from '../../shared/validators/must-match.validator';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {FeedbackDialog} from '../../core/components/feedback-dialog.component';
import {MatOption, MatSelect} from '@angular/material/select';
import {Pool} from '../../pool/pool.model';
import {PoolService} from '../../core/services/pool.service';
import {MatCheckbox} from '@angular/material/checkbox';

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
    NgForOf,
    MatCheckbox
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerUserForm: FormGroup;

  submitted: boolean = false;

  pools: Pool[] = [];
  private backUrl = '/user-management';


  constructor(private formBuilder: FormBuilder, private logger: LoggerService,
              private userService: UserService, private router: Router,
              private dialog: MatDialog, private poolService: PoolService,) {
    this.registerUserForm = this.formBuilder.group({
        name: ['', Validators.required],
        username: ['', [Validators.required, Validators.email]],
        pool: new FormControl('', [Validators.required]),
        roles: this.formBuilder.group({
          PLAYER: [false],
          ADMIN: [false],
        }, {validators: atLeastOneRoleSelected}),
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
    if (this.registerUserForm.valid) {
      this.submitted = true;
      this.registerUser();
    }
  }

  private registerUser() {
    const roles = this.registerUserForm.value.roles;
    const userRoles = Object.entries(roles)
      .filter(([_, enabled]) => enabled)
      .map(([role]) => role);

    let registerUserRequest = {
      name: this.formFields['name'].value,
      username: this.formFields['username'].value,
      password: this.formFields['password'].value,
      poolId: this.formFields['pool'].value,
      userRoles: userRoles,
    }
    this.userService.registerUser(registerUserRequest).subscribe({
        next: (response) => {
          this.dialog.open(FeedbackDialog, {
            data: {
              title: 'Registration Succeeded',
              message: 'User was successfully registered!',
            }, panelClass: 'custom-dialog-container',
          }).afterClosed().subscribe(() => {
            this.router.navigate([this.backUrl]);
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


  goBack() {
    this.router.navigate([this.backUrl]);
  }

}

function atLeastOneRoleSelected(group: AbstractControl): ValidationErrors | null {
  const roles = group.value;
  return Object.values(roles).some(role => role) ? null : { noRoleSelected: true };
}

