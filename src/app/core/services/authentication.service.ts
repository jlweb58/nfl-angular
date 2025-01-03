import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LoggerService} from './logger.service';
import {JwtResponse} from '../models/jwt-response.model';
import {LoginRequest} from '../models/login-request.model';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private serviceUrl = environment.baseUrl + '/nfl-survivor/login';

  constructor(private http: HttpClient, private logger: LoggerService) { }

  authenticate(username: string, password: string): Observable<any> {
    const loginRequest: LoginRequest = new LoginRequest(username, password);
    return this.http.post<JwtResponse>(this.serviceUrl, loginRequest);
  }
}
