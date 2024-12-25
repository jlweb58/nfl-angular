import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoggerService} from './logger.service';
import {Team} from '../models/team.model';


@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private serviceUrl = environment.baseUrl + '/nfl-survivor/teams';

  constructor(private http: HttpClient, private logger: LoggerService) {}

 getTeams() {

    return this.http.get<Team[]>(this.serviceUrl);
 }

}
