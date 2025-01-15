import {User} from '../../user/user.model';

export interface JwtResponse {
  accessToken: string;
  user: User;
}
