import {Component, OnInit} from '@angular/core';
import {Game} from '../core/models/game.model';
import {LoggerService} from '../core/services/logger.service';
import {GameService} from '../core/services/game.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {Team} from '../core/models/team.model';
import {TeamService} from '../core/services/team.service';
import {WeeklyTeamScore} from '../core/models/weekly-team-score.model';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-game-component',
  imports: [
    CommonModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {

  games: Game[];
  columnsToDisplay :string[] = ['awayTeam', 'homeTeam', 'venue', 'gameStartingTime', 'pointSpread', 'score'];
  weekToDisplay:number = 1;

  constructor(private logger: LoggerService, private gameService: GameService, private teamService: TeamService) {
    this.games = [];
  }

  ngOnInit(): void {
    this.loadGames();
  }

  private loadGames() {
    this.gameService.getGamesForYearAndWeek(2024, this.weekToDisplay).subscribe(
      results => {
        if (!results) {
          return;
        }
        this.games = results;
      }
    );
  }

  previousWeek(): void {
    if (this.weekToDisplay == 1) { return; }
    this.weekToDisplay--;
    this.loadGames();
  }

  nextWeek(): void {
    if (this.weekToDisplay == 18) { return; }
    this.weekToDisplay++;
    this.loadGames();
  }

  getFormattedWeeklyTeamScore(weeklyTeamScore: WeeklyTeamScore): string {
    return "(" + weeklyTeamScore.winCount + "-" + weeklyTeamScore.lossCount + "-" + weeklyTeamScore.tieCount + ")";

  }

  getFormattedWeeklyResultForTeamAndWeek(team: Team, week :number): void {
    this.teamService.getWeeklyResultForTeamAndWeek(team.id, week).subscribe(
      results => {
        if (!results) { return; }
        team.weeklyTeamScore = results;
      }
    );
  }

  protected readonly DateTime = DateTime;
}
