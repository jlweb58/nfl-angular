import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LoggerService} from './logger.service';
import {ChangePasswordRequest} from '../../user/change-password/change-password-request.model';
import {ChangePasswordResponse} from '../../user/change-password/change-password-response.model';
import {environment} from '../../../environments/environment';
import {RegisterUserRequest} from '../../user/register/register-user-request.model';
import {RegisterUserResponse} from '../../user/register/register-user-response.model';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {User} from '../../user/user.model';

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
          this.message = data.message;
        }
      );
  }

  registerUser(registerUserRequest: RegisterUserRequest):Observable<RegisterUserResponse> {
    return this.http
      .post<RegisterUserResponse>(this.serviceUrl + '/register', registerUserRequest)
      .pipe(
        catchError((error) => {
          throw new Error(error);
        })
      )
  }

  getUser(userId: number) : Observable<User> {
    return this.http
      .get<User>(this.serviceUrl + '/' + userId)
      .pipe(
        catchError((error) => {
          throw new Error(error);
        })
      )
  }

  updateUser(updatedUser: User):Observable<User> {
    return this.http
      .put<User>(this.serviceUrl, updatedUser)
      .pipe(
        catchError((error) => {
          throw new Error(error);
        })
      )
  }
}
