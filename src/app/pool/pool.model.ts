import {User} from '../user/user.model';

export interface Pool {
  id: number;
  name: string;
  poolMembers: User[];
}
