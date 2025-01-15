import {Team} from '../../team/team.model';
import {Game} from '../../game/game.model';
import {GameResult} from '../../game/game-result.model';

export class WeeklyGameSelection {

  game: Game;

  winningTeamSelection: Team;

  gameResult?: GameResult;

  week: number;

  constructor(game: Game, winningTeamSelection: Team) {
    this.game = game;
    this.winningTeamSelection = winningTeamSelection;
    this.week = game.week;
  }

}
