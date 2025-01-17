import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {LoggerService} from '../core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class SeasonWeekService {

  private serviceUrl = environment.baseUrl + '/nfl-survivor/season-weeks';
  private currentGameWeekSubject = new BehaviorSubject<number | null>(null);

  readonly currentGameWeek$ = this.currentGameWeekSubject.asObservable();
  constructor(private http: HttpClient, private logger: LoggerService) {
    this.refreshCurrentGameWeek();
  }

  refreshCurrentGameWeek(): void {
    this.fetchCurrentGameWeek().subscribe({
      next: (result) => this.currentGameWeekSubject.next(result),
      error: (error) => this.logger.log('Failed to refresh active season week')
    });
  }

  private fetchCurrentGameWeek():Observable<number> {
    return this.http.get<number>(this.serviceUrl + '/active-week').pipe(
      map(result =>{
        return result;
      }),
      catchError(error => {
        this.logger.log('Error fetching current active season week: ' + error);
        throw error;
      })
    );
  }
}
