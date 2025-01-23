import {Team} from '../../team/team.model';
import {Game} from '../../game/game.model';
import {GameResult} from '../../game/game-result.model';
import {User} from '../../user/user.model';

export interface WeeklyGameSelection {

  id: number;
  selectedGame: Game;
  winningTeamSelection: Team;
  gameResult?: GameResult;
  week: number;
  user: User;
}
