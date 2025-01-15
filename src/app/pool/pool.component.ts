import {Component, OnInit} from '@angular/core';
import {Pool} from './pool.model';
import {PoolService} from '../core/services/pool.service';
import {LoggerService} from '../core/services/logger.service';
import {MatDialog} from '@angular/material/dialog';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';
import {PoolCreateDialogComponent} from './pool-create-dialog/pool-create-dialog.component';

@Component({
  selector: 'app-pool',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatIcon,
    MatFabButton
  ],
  templateUrl: './pool.component.html',
  styleUrl: './pool.component.css'
})
export class PoolComponent implements OnInit {
  pools: Pool[] = [];
  columnsToDisplay: string[] = ['id', 'name'];

  constructor(private poolService: PoolService,
              private logger: LoggerService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadPools();
  }

  private loadPools(): void {
    this.poolService.getPools().subscribe(
      pools => {
      if (!pools) {
        return;
      }
      this.pools = pools;
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(PoolCreateDialogComponent, {width: '300px'});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.poolService.createPool(result).subscribe(() => {
          this.loadPools();
        })
      }
    })
  }
}
