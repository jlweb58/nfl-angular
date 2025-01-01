import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoggerService} from './logger.service';
import {Team} from '../models/team.model';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private serviceUrl = environment.baseUrl + '/nfl-survivor/teams';

  constructor(private http: HttpClient, private logger: LoggerService) {}

 getTeams() :Observable<Team[]> {

    return this.http.get<Team[]>(this.serviceUrl);
 }

}
