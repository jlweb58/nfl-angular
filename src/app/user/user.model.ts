import {Pool} from '../pool/pool.model';
import {UserRole} from './user-role.model';
import {WeeklyGameSelection} from '../core/models/weekly-game-selection.model';
import {PlayerStatus} from './player-status.model';

export interface User {
  id: number;
  authenticated: boolean;
  eliminated: boolean;
  password: string;
  name: string;
  email: string;
  userRoles: UserRole[];
  pools: number[];
  weeklyGameSelections: WeeklyGameSelection[];
  playerStatus: PlayerStatus;
}
