import {Component, OnInit, Output} from '@angular/core';
import {LoggerService} from '../../core/services/logger.service';
import {UserService} from '../../core/services/user.service';
import {User} from '../../user/user.model';
import {Pool} from '../../pool/pool.model';
import {
  MatCell, MatCellDef,
  MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {TokenStorageService} from '../../core/services/token-storage.service';
import {PoolService} from '../../core/services/pool.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-management',
  imports: [
    MatTable,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  currentPool: Pool | null = null;
  columnsToDisplay: string[] = ['name', 'email', 'userRoles', 'playerStatus']


  constructor(private userService: UserService, private logger: LoggerService,
              private poolService: PoolService,
              private tokenStorageService: TokenStorageService,
              private router: Router,) {
  }

  ngOnInit(): void {
    let currentUser: User | null = this.tokenStorageService.getUser();
    this.poolService.getPoolsForUser(<number>currentUser?.id).subscribe(
      results => {
        if (!results) {
          return;
        }
        this.users = results[0].poolMembers;
        this.currentPool = results[0];
      }
    );
    }

  onRowClick(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }
}
