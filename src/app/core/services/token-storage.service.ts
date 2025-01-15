import {Injectable} from '@angular/core';
import {User} from '../../user/user.model';
import {UserRole} from '../../user/user-role.model';
import {Pool} from '../../pool/pool.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  logout() {
    sessionStorage.clear();
  }

  public saveToken(token: string) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string|null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user :User) {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): User|null {
    let storedUser = sessionStorage.getItem(USER_KEY);
    if (storedUser === null) {
      return null;
    }
    let parsedUser: User = JSON.parse(storedUser);
    return parsedUser;
  }

  public getUserRoles(): UserRole[] {
    let currentUser  = this.getUser();
    if (!currentUser) return [];
    return currentUser.userRoles;
  }

  public getUserPool(): Pool | null {
    let currentUser  = this.getUser();
    if (!currentUser) return null;
    //needed because Array.at() can returned undefined; the
    //?? operator coalesces undefined to null
    return currentUser.pools.at(0) ?? null;
  }
}
