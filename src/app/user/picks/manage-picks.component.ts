import {Component, OnInit} from '@angular/core';
import {LoggerService} from '../../core/services/logger.service';
import {UserService} from '../../core/services/user.service';
import {MatCard} from '@angular/material/card';
import {WeeklyGameSelection} from '../../core/models/weekly-game-selection.model';
import {WeeklyGameSelectionService} from '../../core/services/weekly-game-selection.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {Team} from '../../team/team.model';
import {GameResult} from '../../game/game-result.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-manage-picks',
  templateUrl: './manage-picks.component.html',
  imports: [
    MatCard,
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatTable,
    MatHeaderRow,
    MatRow,
    NgClass,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,

  ],
  styleUrls: ['./manage-picks.component.css']
})
export class ManagePicksComponent implements OnInit {


  weeklyGameSelectionsForUser: WeeklyGameSelection[] = [];

  columnsToDisplay :string[] = ['week', 'pickedTeam', 'result', 'score'];

  constructor(private logger: LoggerService,
              private userService: UserService,
              private weeklyGameSelectionService: WeeklyGameSelectionService) {

  }

  ngOnInit(): void {
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

  getClassForResult(gameResult: GameResult) {
    return {
      'label-win-result': gameResult === GameResult.WIN,
      'label-loss-result': gameResult === GameResult.LOSS,
      'label-tie-result': gameResult === GameResult.TIE
    }

  }

}
