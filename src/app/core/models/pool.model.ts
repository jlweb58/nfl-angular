import {User} from './user.model';

export interface Pool {
  id: number;
  name: string;
  poolMembers: User[];
}
