import {Component, OnInit} from '@angular/core';
import {LoggerService} from '../core/services/logger.service';
import {TeamService} from '../core/services/team.service';
import { Team } from '../core/models/team.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-team-list',
  templateUrl: './team.component.html',
  imports: [
    CommonModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef
  ],
  styleUrls: ['./team.component.css']

})
export class TeamComponent implements OnInit {

  teams: Team[];
  columnsToDisplay = ['name', 'logo'];

  constructor(private logger: LoggerService, private teamService: TeamService) {
    this.teams = [];
  }

  ngOnInit(): void {
       this.teamService.getTeams().subscribe(
         results => {
           if (!results) { return; }
          this.teams = results;
         }
       );
    }


}
