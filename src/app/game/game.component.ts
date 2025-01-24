import {Component, HostListener, OnInit} from '@angular/core';
import {Game} from './game.model';
import {LoggerService} from '../core/services/logger.service';
import {GameService} from '../core/services/game.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
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
import {Observable} from 'rxjs';
import {SeasonWeekService} from '../season/season-week.service';
import {WeeklyTeamScorePipe} from '../core/pipes/weekly-team-score.pipe';
import {GamePickButtonComponent} from './game-pick-button/game-pick-button.component';

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
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    WeeklyTeamScorePipe,
    GamePickButtonComponent
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
  userStatus: PlayerStatus = PlayerStatus.ACTIVE;

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
    this.loadWeeklyGameSelections();
    this.seasonWeekService.refreshCurrentGameWeek();
    this.dateTimeService.refreshDateTime();
    this.setUserStatus();
    this.activeGameWeek$.subscribe(
      results => {
        if (!results) {
          return;
        }
        this.weekToDisplay = results;
        this.loadGames();
      }

    );
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

  private setUserStatus(): void {
    let currentUser: User = <User>this.tokenStorageService.getUser();
    this.userStatus =  currentUser.playerStatus;
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

  unsetWeeklyPlayerPick(game: Game): void {
    let selectionToDelete  = this.weeklyGameSelectionsForUser.find(
      wgs => wgs.selectedGame.id === game.id
    );
    if (selectionToDelete) {
      this.weeklyGameSelectionService.deleteWeeklyGameSelection(selectionToDelete).subscribe({
        next: () => {
          this.dialog.open(FeedbackDialog, {
            data: {
              title: 'Pick cleared',
              message: 'Your pick for week ' + game.week + ' was cleared',
            }, panelClass: 'custom-dialog-container',

          }).afterClosed().subscribe(() => {
            this.loadGames();
            this.loadWeeklyGameSelections();// Refresh the data instead of reloading the page
          });
        },
        error: (e) => {
          this.dialog.open(FeedbackDialog, {
            data: {
              title: 'Pick not cleared',
              message: 'Your pick deletion for week ' + game.week + ' failed because ' + e.message,
            }, panelClass: 'custom-dialog-container',
          });
        },
      });
    }
  }

  protected readonly DateTime = DateTime;
}
