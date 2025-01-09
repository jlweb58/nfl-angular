import { Injectable } from '@angular/core';
import {LoggerService} from './logger.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Pool} from '../models/pool.model';

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  private serviceUrl = environment.baseUrl + '/nfl-survivor/pools';

  constructor(private http: HttpClient, private logger: LoggerService) { }

  getPools(): Observable<Pool[]> {
    return this.http.get<Pool[]>(this.serviceUrl);
  }

  createPool(Pool: Pool): Observable<Pool> {
    return this.http.post<Pool>(this.serviceUrl, Pool);
  }
}
