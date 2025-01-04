import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LoggerService} from './logger.service';
import {ChangePasswordRequest} from '../models/change-password-request.model';
import {ChangePasswordResponse} from '../models/change-password-response.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private serviceUrl = environment.baseUrl + '/nfl-survivor/users/password';
  private message: string;

  constructor(private logger: LoggerService, private http: HttpClient) {
    this.message = '';
  }

  changePassword(changePasswordRequest: ChangePasswordRequest) {
    this.http
      .post<ChangePasswordResponse>(this.serviceUrl, changePasswordRequest)
      .subscribe(
        data => {
          this.logger.log('Change password successful');
          this.message = data.message;
        }
      );
  }
}
