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
  columnsToDisplay :string[] = ['awayTeam', 'homeTeam', 'gameStartingTime', 'pointSpread', 'score'];
  weekToDisplay:number = 1;

  constructor(private logger: LoggerService, private gameService: GameService) {
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

}
