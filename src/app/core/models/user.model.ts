import {Pool} from './pool.model';
import {UserRole} from './user-role.model';
import {WeeklyGameSelection} from './weekly-game-selection.model';

export interface User {
  id: number;
  authenticated: boolean;
  name: string;
  roles: UserRole[];
  pools: Pool[];
  weeklyGameSelections: WeeklyGameSelection[];
}
