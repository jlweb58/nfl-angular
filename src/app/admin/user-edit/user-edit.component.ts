import {Component, OnInit} from '@angular/core';
import {User} from '../../user/user.model';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {UserRole} from '../../user/user-role.model';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-user-edit',
  imports: [
    MatIconButton,
    MatIcon,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatError,
    NgIf,
    MatCheckbox
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {
  user: User | null = null;
  userForm: FormGroup;
  saving = false;
  roles = {
    PLAYER: false,
    ADMIN: false
  }
  private backUrl = '/user-management';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      playerStatus: [''],
      roles: this.fb.group({
        PLAYER: [false],
        ADMIN: [false],
      }, {validators: atLeastOneRoleSelected})
    });
  }

  ngOnInit() {
    const userId = this.route.snapshot.params['id'];
    this.userService.getUser(userId).subscribe(user => {
      this.user = user;
      this.userForm.patchValue(user);
      const userRoles = this.user?.userRoles || [];
      this.userForm.patchValue({
        roles: {
          PLAYER: userRoles.includes(UserRole.PLAYER),
          ADMIN: userRoles.includes(UserRole.ADMIN)
        }
      })
    });
  }

  onSubmit() {
    if (this.userForm.valid && this.user) {
      this.saving = true;
      const roles = this.userForm.value.roles;
      const userRoles = Object.entries(roles)
        .filter(([_, enabled]) => enabled)
        .map(([role]) => role);

      const updatedUser = {
        ...this.user,
        ...this.userForm.value,
        userRoles
      };this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate([this.backUrl]);
        },
        error: (error) => {
          this.saving = false;
          // Handle error - show message to user
        }
      });
    }
  }

  goBack() {
    this.router.navigate([this.backUrl]);
  }


}

function atLeastOneRoleSelected(group: AbstractControl): ValidationErrors | null {
  const roles = group.value;
  return Object.values(roles).some(role => role) ? null : { noRoleSelected: true };
}

