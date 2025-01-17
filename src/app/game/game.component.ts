import {Component, HostListener, OnInit} from '@angular/core';
import {Game} from './game.model';
import {LoggerService} from '../core/services/logger.service';
import {GameService} from '../core/services/game.service';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Team} from '../team/team.model';
import {DateTime} from 'luxon';
import {WeeklyGameSelectionService} from '../core/services/weekly-game-selection.service';
import {WeeklyGameSelection} from '../core/models/weekly-game-selection.model';
import {MatDialog} from '@angular/material/dialog';
import {FeedbackDialog} from '../core/components/feedback-dialog.component';
import {TokenStorageService} from '../core/services/token-storage.service';
import {User} from '../user/user.model';
import {PlayerStatus} from '../user/player-status.model';
import {DateTimeService} from '../core/services/date-time.service';
import {combineLatest, map, Observable, of} from 'rxjs';
import {SeasonWeekService} from '../season/season-week.service';

@Component({
  selector: 'app-game-component',
  imports: [
    CommonModule,
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatRow,
    MatTable,
    MatIcon,
    MatIconButton,
    MatButton,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {

  games: Game[];
  columnsToDisplay: string[] = ['awayTeam', 'homeTeam', 'venue', 'gameStartingTime', 'pointSpread', 'score'];
  weekToDisplay: number = 1;
  weeklyGameSelectionsForUser: WeeklyGameSelection[] = [];
  currentDateTime$: Observable<DateTime | null>;
  // This is not the week to display, but the week for which
  // picks are currently allowed.
  activeGameWeek$: Observable<number | null>;

  constructor(private logger: LoggerService, private gameService: GameService,
              private weeklyGameSelectionService: WeeklyGameSelectionService,
              private dialog: MatDialog,
              private tokenStorageService: TokenStorageService,
              private readonly dateTimeService: DateTimeService,
              private readonly seasonWeekService: SeasonWeekService,) {
    this.games = [];
    this.currentDateTime$ = this.dateTimeService.currentDateTime$
    this.activeGameWeek$ = this.seasonWeekService.currentGameWeek$;
  }

  ngOnInit(): void {
    this.loadGames();
    this.loadWeeklyGameSelections();
    this.seasonWeekService.refreshCurrentGameWeek();
    this.dateTimeService.refreshDateTime();
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

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowLeft': this.previousWeek(); break;
      case 'ArrowRight': this.nextWeek(); break;
    }
  }


  isGameAndTeamPickable(game: Game, team: Team): Observable<boolean> {
    if (this.isCurrentUserEliminated()) { return of(false); }
    return combineLatest([
      this.currentDateTime$,
      this.activeGameWeek$
        ]).pipe(
      map(([currentTime, activeWeek]) => {
        if (!currentTime || activeWeek === null) {return false;}
        const gameTime: DateTime = DateTime.fromISO(game.startTime.toString()).toUTC()
        return currentTime < gameTime &&
          !this.wasTeamAlreadySelected(team) &&
          !this.isAlreadySelectionForWeek(game) &&
          game.week === activeWeek;
      })
    );
  }

  private isCurrentUserEliminated(): boolean {
    let currentUser: User = <User>this.tokenStorageService.getUser();
    return currentUser.playerStatus === PlayerStatus.ELIMINATED;
  }

  private wasTeamAlreadySelected(team: Team): boolean {
    return this.weeklyGameSelectionsForUser.some((wgs) => wgs.winningTeamSelection.id === team.id);
  }

  private isAlreadySelectionForWeek(game: Game): boolean {
    return this.weeklyGameSelectionsForUser.some((wgs) => wgs.week === game.week);
  }

  isPlayerPickForWeek(team: Team): boolean {
    let currentWeekGameSelection = this.weeklyGameSelectionsForUser.find((wgs) => wgs.week === this.weekToDisplay)
    if (!currentWeekGameSelection) { return false; }
    return currentWeekGameSelection.winningTeamSelection.id === team.id;
  }

  previousWeek(): void {
    if (this.weekToDisplay == 1) {
      return;
    }
    this.weekToDisplay--;
    this.loadGames();
  }

  nextWeek(): void {
    if (this.weekToDisplay == 18) {
      return;
    }
    this.weekToDisplay++;
    this.loadGames();
  }

  setWeeklyPlayerPick(game: Game, team: Team): void {
    this.weeklyGameSelectionService.setWeeklyGameSelection(game, team).subscribe({
      next: () => {
        this.dialog.open(FeedbackDialog, {
          data: {
            title: 'Pick succeeded',
            message: 'Your pick of team ' + team.name + ' for week ' + game.week + ' succeeded.',
          }, panelClass: 'custom-dialog-container',

        }).afterClosed().subscribe(() => {
          this.loadGames();
          this.loadWeeklyGameSelections();// Refresh the data instead of reloading the page
        });
      },
      error: (e) => {
        this.dialog.open(FeedbackDialog, {
          data: {
            title: 'Pick failed',
            message: 'Your pick of team ' + team.name + ' for week ' + game.week + ' failed because ' + e.message,
          }, panelClass: 'custom-dialog-container',
        });
      },
    });
  }

  protected readonly DateTime = DateTime;
}
