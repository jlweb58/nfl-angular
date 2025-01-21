import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Game} from '../game.model';
import {Team} from '../../team/team.model';
import {MatButton} from '@angular/material/button';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {WeeklyGameSelection} from '../../core/models/weekly-game-selection.model';
import {combineLatest, map, Observable, of} from 'rxjs';
import {DateTime} from 'luxon';
import {PlayerStatus} from '../../user/player-status.model';

@Component({
  selector: 'app-game-pick-button',
  imports: [
    MatButton,
    NgClass,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './game-pick-button.component.html',
  styleUrl: './game-pick-button.component.css'
})
export class GamePickButtonComponent {
  @Input() game!: Game;
  @Input() team!: Team;
  @Input() weeklyGameSelectionsForUser!: WeeklyGameSelection[];
  @Input() userStatus!: PlayerStatus;
  @Input() currentDateTime$!: Observable<DateTime | null>;
  @Input() activeGameWeek$!: Observable<number | null>;
  @Input() weekToDisplay!: number;
  @Output() pickSelected = new EventEmitter<{game: Game, team: Team}>();
  @Output() pickChanged = new EventEmitter<{game: Game}>();

  isHovering = false;

  onPickSelected(): void {
    if (this.isPlayerPickForWeek()) {
      this.pickChanged.emit({ game: this.game});
    } else {
      this.pickSelected.emit({ game: this.game, team: this.team });
    }
  }

  isPlayerPickForWeek(): boolean {
    let currentWeekGameSelection = this.weeklyGameSelectionsForUser.find((wgs) => wgs.week === this.weekToDisplay)
    if (!currentWeekGameSelection) { return false; }
    return currentWeekGameSelection.winningTeamSelection.id === this.team.id;
  }

  private wasTeamAlreadySelected(): boolean {
    return this.weeklyGameSelectionsForUser.some((wgs) => wgs.winningTeamSelection.id === this.team.id);
  }

  private isAlreadySelectionForWeek(): boolean {
    return this.weeklyGameSelectionsForUser.some((wgs) => wgs.week === this.game.week);
  }


  isGameAndTeamPickable(): Observable<boolean> {
    if (this.userStatus === PlayerStatus.ELIMINATED) { return of(false); }
     if (this.isPlayerPickForWeek()) { return of(true); }
    return combineLatest([
      this.currentDateTime$,
      this.activeGameWeek$
    ]).pipe(
      map(([currentTime, activeWeek]) => {
        if (!currentTime || activeWeek === null) {return false;}
        const gameTime: DateTime = DateTime.fromISO(this.game.startTime.toString()).toUTC()
        return currentTime < gameTime &&
          !this.wasTeamAlreadySelected() &&
          !this.isAlreadySelectionForWeek() &&
          (this.game.week === activeWeek|| this.game.week === 1 && activeWeek === 0);
      })
    );
  }
}
