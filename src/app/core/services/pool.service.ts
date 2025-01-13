import { Injectable } from '@angular/core';
import {LoggerService} from './logger.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map, Observable, of, tap} from 'rxjs';
import {Pool} from '../models/pool.model';
import {catchError} from 'rxjs/operators';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  private serviceUrl = environment.baseUrl + '/nfl-survivor/pools';
  private poolsCache: Pool[] | null = null;
  private cacheValid: boolean = false;

  constructor(private http: HttpClient, private logger: LoggerService) { }

  getPools(): Observable<Pool[]> {
    if (this.cacheValid && this.poolsCache) {
      return of(this.poolsCache);
    }
    return this.http.get<Pool[]>(this.serviceUrl).pipe(
      tap((pools) => {
        this.poolsCache = pools;
        this.cacheValid = true;
      }),
      catchError((error) => {
        this.logger.log('Error fetching pools: ' + error.toString());
        throw error;
      })
    );
  }

  createPool(Pool: Pool): Observable<Pool> {
    return this.http.post<Pool>(this.serviceUrl, Pool).pipe(
      tap(() => {
        this.invalidateCache();
      }),
      catchError((error) => {
        this.logger.log('Error creating pool: ' + error.toString());
        throw error;
      })
    );
  }

  isUserInPool(user: User, poolId: number): Observable<boolean> {
    return this.getPools().pipe(
      map((pools) => {
        return pools.some((pool) => pool.id === poolId && pool.poolMembers.includes(user));
      }),
      catchError((error) => {
        this.logger.log('Unexpected error checking pool membership ' + error.toString());
        throw error;
      })
    );
  }


  private invalidateCache(): void {
    this.cacheValid = false;
    this.poolsCache = null;
  }
}
