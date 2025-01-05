import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoggerService} from './logger.service';
import {Team} from '../models/team.model';
import {Game} from '../models/game.model';
import {WeeklyGameSelection} from '../models/weekly-game-selection.model';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WeeklyGameSelectionService {

  private serviceUrl = environment.baseUrl + '/nfl-survivor/weeklygameselections/';

  constructor(private http: HttpClient, private logger: LoggerService) {
  }

  setWeeklyGameSelection(game: Game, team: Team) : Observable<any>{
    return this.http.post<WeeklyGameSelection>(this.serviceUrl + game.id + '/' + team.id, {});
  }

}
