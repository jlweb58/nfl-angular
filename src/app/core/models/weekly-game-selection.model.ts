import {Team} from './team.model';
import {Game} from './game.model';
import {GameResult} from './game-result.model';

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
