import {Component, OnInit} from '@angular/core';
import {Pool} from '../../core/models/pool.model';
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
import {User} from '../../core/models/user.model';
import {NgForOf} from '@angular/common';
import {WeeklyGameSelectionService} from '../../core/services/weekly-game-selection.service';

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
  ],
  templateUrl: './pool-table.component.html',
  styleUrl: './pool-table.component.css'
})
export class PoolTableComponent implements OnInit {

  displayedColumns: string[] = [];
  pool: Pool | null = null;
  dataSource = new MatTableDataSource<User>([]);
  weeks = Array.from({length: 18}, (_, i) => `week${i + 1}`);

  constructor(private poolService: PoolService, private tokenStorageService: TokenStorageService,
              private weeklyGameSelectionService: WeeklyGameSelectionService) {}

  ngOnInit(): void {
    this.pool = this.tokenStorageService.getUserPool();
    this.dataSource = new MatTableDataSource(this.pool?.poolMembers);
    this.initializeWeeklyGameSelections();
    this.displayedColumns = ['name', ...this.weeks];
  }

  private initializeWeeklyGameSelections(): void {
    this.pool?.poolMembers.forEach((member: User) => {
      this.weeklyGameSelectionService.getForUser(member.id).subscribe(
        results => {
          if (!results) {
            return;
          }
          member.weeklyGameSelections = results;
        }
      );
    })
  }

}
