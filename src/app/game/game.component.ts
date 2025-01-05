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
import {MatButton, MatIconButton} from '@angular/material/button';
import {Team} from '../core/models/team.model';
import {WeeklyTeamScore} from '../core/models/weekly-team-score.model';
import {DateTime} from 'luxon';
import {WeeklyGameSelectionService} from '../core/services/weekly-game-selection.service';

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
    MatIconButton,
    MatButton
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {

  games: Game[];
  columnsToDisplay :string[] = ['awayTeam', 'homeTeam', 'venue', 'gameStartingTime', 'pointSpread', 'score'];
  weekToDisplay:number = 1;

  constructor(private logger: LoggerService, private gameService: GameService,
              private weeklyGameSelectionService: WeeklyGameSelectionService) {
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

  setWeeklyPlayerPick(game :Game, team :Team) :void {
    this.weeklyGameSelectionService.setWeeklyGameSelection(game, team).subscribe({
        error: (e) => this.logger.log('Error: ' + e.message),
        complete: () => this.logger.log('Pick succeeded'),
      }
    );
  }

  protected readonly DateTime = DateTime;
}
