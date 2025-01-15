import {Pool} from './pool.model';
import {UserRole} from './user-role.model';
import {WeeklyGameSelection} from './weekly-game-selection.model';
import {PlayerStatus} from './player-status.model';

export interface User {
  id: number;
  authenticated: boolean;
  name: string;
  roles: UserRole[];
  pools: Pool[];
  weeklyGameSelections: WeeklyGameSelection[];
  playerStatus: PlayerStatus;
}
