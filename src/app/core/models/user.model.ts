import {Pool} from './pool.model';
import {UserRole} from './user-role.model';

export class User {
  authenticated: boolean;
  name: string;
  roles: UserRole[];
  pools: Pool[];

  constructor(name :string) {
    this.name = name;
    this.authenticated = true;
    this.roles = [];
    this.pools = [];
  }
}
