import {Pool} from '../../pool/pool.model';
import {UserRole} from '../user-role.model';

export interface RegisterUserRequest {
  name: string;
  username: string;
  password: string;
  poolId: number;
  userRoles: string[];

}
