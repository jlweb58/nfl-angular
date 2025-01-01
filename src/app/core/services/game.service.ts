import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LoggerService} from './logger.service';
import {Observable} from 'rxjs';
import {Game} from '../models/game.model';


@Injectable({
    providedIn: 'root'
  }
)
export class GameService {

  private serviceUrl = environment.baseUrl + '/nfl-survivor/games';

  constructor(private http: HttpClient, private logger: LoggerService) {}


  getGamesForYearAndWeek(year: number, week: number) :Observable<Game[]>   {
    let params = new HttpParams();
    params = params.set('year', year);
    params = params.set('week', week);
    return this.http.get<Game[]>(this.serviceUrl, { params });
  }


}
