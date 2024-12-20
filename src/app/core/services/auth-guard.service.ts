import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {TokenStorageService} from './token-storage.service';
import {LoggerService} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private logger: LoggerService) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    if (this.tokenStorageService.getUser()) {
      this.logger.log('AuthGuardService.canActivate');
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
