import {Pool} from '../../pool/pool.model';

export interface RegisterUserRequest {
  name: string;
  username: string;
  password: string;
  poolId: number;

}
