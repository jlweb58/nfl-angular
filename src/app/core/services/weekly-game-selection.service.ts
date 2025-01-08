import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LoggerService} from './logger.service';
import {Team} from '../models/team.model';
import {Game} from '../models/game.model';
import {WeeklyGameSelection} from '../models/weekly-game-selection.model';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class WeeklyGameSelectionService {

  private serviceUrl = environment.baseUrl + '/nfl-survivor/weeklygameselections';

  constructor(private http: HttpClient, private logger: LoggerService) {
  }

  setWeeklyGameSelection(game: Game, team: Team) : Observable<any>{
    return this.http.post<{ message: string }>(
      `${this.serviceUrl}/${game.id}/${team.id}`,
      {}
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        // Customize the error message
        const errorMessage = error.error?.error || 'Failed to submit pick.';
        return throwError(() => new Error(errorMessage));
      })
    );  }

  getAllForCurrentUser(): Observable<WeeklyGameSelection[]> {
    return this.http.get<WeeklyGameSelection[]>(this.serviceUrl);
  }

}
