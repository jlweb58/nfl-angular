import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LoggerService} from './logger.service';
import {ChangePasswordRequest} from '../../user/change-password/change-password-request.model';
import {ChangePasswordResponse} from '../../user/change-password/change-password-response.model';
import {environment} from '../../../environments/environment';
import {RegisterUserRequest} from '../../user/register/register-user-request.model';
import {RegisterUserResponse} from '../../user/register/register-user-response.model';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private serviceUrl = environment.baseUrl + '/nfl-survivor/users';
  private message: string;

  constructor(private logger: LoggerService, private http: HttpClient) {
    this.message = '';
  }

  changePassword(changePasswordRequest: ChangePasswordRequest) {
    this.http
      .post<ChangePasswordResponse>(this.serviceUrl + '/password', changePasswordRequest)
      .subscribe(
        data => {
          this.logger.log('Change password successful');
          this.message = data.message;
        }
      );
  }

  registerUser(registerUserRequest: RegisterUserRequest):Observable<RegisterUserResponse> {
    this.logger.log('UserService: registerUser');
    return this.http
      .post<RegisterUserResponse>(this.serviceUrl + '/register', registerUserRequest)
      .pipe(
        catchError((error) => {
          throw new Error(error);
        })
      )
  }
}
