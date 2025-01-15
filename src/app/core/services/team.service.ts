import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LoggerService} from './logger.service';
import {Team} from '../../team/team.model';
import {Observable} from 'rxjs';
import {WeeklyTeamScore} from '../models/weekly-team-score.model';


@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private serviceUrl = environment.baseUrl + '/nfl-survivor/teams';

  constructor(private http: HttpClient, private logger: LoggerService) {
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.serviceUrl);
  }

  getWeeklyResultForTeamAndWeek(teamId :number, week :number): Observable<WeeklyTeamScore> {
    let params :HttpParams = new HttpParams();
    params = params.set('week', week);
    return this.http.get<WeeklyTeamScore>(this.serviceUrl + '/' + teamId,  { params });
  }


}
