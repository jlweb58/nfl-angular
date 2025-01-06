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
import {WeeklyGameSelection} from '../core/models/weekly-game-selection.model';

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
  weeklyGameSelectionsForUser: WeeklyGameSelection[] = [];

  constructor(private logger: LoggerService, private gameService: GameService,
              private weeklyGameSelectionService: WeeklyGameSelectionService) {
    this.games = [];
  }

  ngOnInit(): void {
    this.loadGames();
    this.loadWeeklyGameSelections();
  }

  private loadWeeklyGameSelections() {
    this.weeklyGameSelectionService.getAllForCurrentUser().subscribe(
      results => {
        if (!results) {
          return;
        }
        this.weeklyGameSelectionsForUser = results;

      }
    );
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


  isGameAndTeamPickable(game: Game, team: Team): boolean {
    (DateTime as any).now = () => DateTime.fromISO("2024-09-01T12:00:00.000Z");
    const currentTime: DateTime = DateTime.now().toUTC();
    const gameTime :DateTime = DateTime.fromISO(game.startTime.toString()).toUTC()
    return currentTime < gameTime && !this.wasTeamAlreadySelected(team) && !this.isAlreadySelectionForWeek(game);

  }

  private wasTeamAlreadySelected(team: Team): boolean {
    return this.weeklyGameSelectionsForUser.some((wgs) => wgs.winningTeamSelection.id === team.id);
  }

  private isAlreadySelectionForWeek(game: Game): boolean {
    return this.weeklyGameSelectionsForUser.some((wgs) => wgs.week === game.week);
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

  setWeeklyPlayerPick(game :Game, team :Team) :void {
    this.weeklyGameSelectionService.setWeeklyGameSelection(game, team).subscribe({
        error: (e) => this.logger.log('Error: ' + e.message),
        complete: () => this.logger.log('Pick succeeded'),
      }
    );
  }

  protected readonly DateTime = DateTime;
  protected readonly Team = Team;
}
