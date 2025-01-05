import {Team} from './team.model';
import {Game} from './game.model';
import {GameResult} from './game-result.model';

export class WeeklyGameSelection {

  private game: Game;

  private team: Team;

  private gameResult?: GameResult;

  constructor(game: Game, team: Team) {
    this.game = game;
    this.team = team;
  }

}
