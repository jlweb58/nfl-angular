import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {TokenStorageService} from './token-storage.service';
import {LoggerService} from './logger.service';
import {UserRole} from '../models/user-role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private logger: LoggerService) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    if (this.tokenStorageService.getUser()) {
      const requiredRoles: string[] = route.data['roles'];
      let userRoles: UserRole[] = this.tokenStorageService.getUserRoles() ;
      return this.hasRequiredRoles(userRoles, requiredRoles);
    }
    this.router.navigate(['login']);
    return false;
  }

  private hasRequiredRoles(userRoles: UserRole[], requiredRoles: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No specific roles required
    }
    const roles = userRoles || [];
    return requiredRoles.every((role) =>
      roles.some((userRole) => userRole === role)
    );
  }

}
