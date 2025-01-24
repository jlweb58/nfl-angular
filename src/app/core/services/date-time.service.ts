import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {LoggerService} from './logger.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, map, Observable, of, tap, throwError, timer} from 'rxjs';
import {DateTime} from 'luxon';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DateTimeService {
  private serviceUrl = environment.baseUrl + '/nfl-survivor/config/datetime';
  private currentDateTimeSubject = new BehaviorSubject<DateTime | null>(null);

  readonly currentDateTime$ = this.currentDateTimeSubject.asObservable();

  constructor(private http: HttpClient, private logger: LoggerService) {
    this.refreshDateTime();
  }

  refreshDateTime(): void {
    this.fetchCurrentDateTime().subscribe({
      next: (dateTime) => this.currentDateTimeSubject.next(dateTime),
      error: (error) => this.logger.log('Failed to refresh datetime: ' + error)
    });
  }

  setDateTime(dateTime: DateTime): Observable<any> {
    let params :HttpParams = new HttpParams();
    params = params.set('fixed', true)
    let strDateTime = dateTime.toISO();
    if (strDateTime === null) {
      return of('null');
    }
    params = params.set('fixedTime', strDateTime);
    return this.http.post(this.serviceUrl, null, {
      params,
      responseType: 'text'  // Explicitly handle text response
    }).pipe(
      catchError(error => {
        this.logger.log('Error setting current datetime: ' + error);
        throw throwError(() => error);
      }
    ));
  }


  private fetchCurrentDateTime():Observable<DateTime> {
    return this.http.get<string>(this.serviceUrl).pipe(
      map(instant => {
        const dateTime = DateTime.fromISO(instant);
        if (!dateTime.isValid) {
          throw new Error(`Invalid datetime received: ${dateTime.invalidReason}`);
        }
        return dateTime;
      }),
      catchError(error => {
        this.logger.log('Error fetching current datetime: ' + error);
        throw error;
      } )
    );
  }

  startAutoRefresh(intervalMs: number = 10000): void {
    timer(0, intervalMs).subscribe(() => this.refreshDateTime());
  }

}
