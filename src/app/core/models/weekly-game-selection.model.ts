import {Team} from '../../team/team.model';
import {Game} from '../../game/game.model';
import {GameResult} from '../../game/game-result.model';

export interface WeeklyGameSelection {

  id: number;
  game: Game;
  winningTeamSelection: Team;
  gameResult?: GameResult;
  week: number;

}
