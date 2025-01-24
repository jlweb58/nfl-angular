import {Component, OnInit} from '@angular/core';
import {Pool} from '../pool.model';
import {PoolService} from '../../core/services/pool.service';
import {TokenStorageService} from '../../core/services/token-storage.service';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {User} from '../../user/user.model';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {WeeklyGameSelectionService} from '../../core/services/weekly-game-selection.service';
import {LoggerService} from '../../core/services/logger.service';
import {WeeklyGameSelection} from '../../core/models/weekly-game-selection.model';

@Component({
  selector: 'app-pool-table',
  imports: [
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    NgForOf,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    NgIf,
    NgClass,
  ],
  templateUrl: './pool-table.component.html',
  styleUrl: './pool-table.component.css'
})
export class PoolTableComponent implements OnInit {

  displayedColumns: string[] = [];
  pool: Pool | null = null;
  dataSource = new MatTableDataSource<User>([]);
  weeks = Array.from({length: 18}, (_, i) => `week${i + 1}`);
  currentUser: User | null = null;


  constructor(private poolService: PoolService, private tokenStorageService: TokenStorageService,
              private weeklyGameSelectionService: WeeklyGameSelectionService,
              private logger: LoggerService) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    this.poolService.getPoolsForUser(<number>this.currentUser?.id).subscribe(
      results => {
        if (!results) {
          return;
        }
        this.pool = results[0];
        this.dataSource = new MatTableDataSource(this.pool?.poolMembers);
        this.initializeWeeklyGameSelections();
        this.displayedColumns = ['name', ...this.weeks];
      }
    );
  }

  shouldShowSelection(weeklyGameSelection: WeeklyGameSelection): boolean {
    if (weeklyGameSelection.user.id === this.currentUser?.id) {
      return true;
    }
    let selectionWeek = weeklyGameSelection.week;
    return this.isCurrentUserSelectionForWeekFinished(selectionWeek);
  }

  private isCurrentUserSelectionForWeekFinished(selectionWeek: number): boolean {
    let userWeeklySelection = this.currentUser?.weeklyGameSelections
      .find(wgs => wgs.week === selectionWeek);
    return !!userWeeklySelection?.selectedGame.finished;

  }

  private initializeWeeklyGameSelections(): void {
    this.pool?.poolMembers.forEach((member: User) => {
      this.weeklyGameSelectionService.getForUser(member.id).subscribe(
        results => {
          if (!results) {
            return;
          }
          member.weeklyGameSelections = results;
          if (member.id === this.currentUser?.id) {
            this.currentUser.weeklyGameSelections = results;
          }
        }
      );
    })
  }

  getClassForSelection(userWeeklyPick: WeeklyGameSelection): string {
   if (!userWeeklyPick ) {
      return '';
    }
    switch (userWeeklyPick.gameResult) {
      case 'WIN': return 'pool-table-result-cell-won';
      case 'LOSS': return 'pool-table-result-cell-lost';
      default: return 'pool-table-result-cell';
    }
  }

}
