import {Component} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {Pool} from '../core/models/pool.model';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'app-pool-create-dialog',
  templateUrl: './pool-create-dialog.component.html',
  styleUrls: ['./pool-create-dialog.component.css'],
  imports: [
    MatDialogTitle,
    MatLabel,
    MatDialogContent,
    MatFormField,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ]
})
export class PoolCreateDialogComponent {

  constructor(public dialogRef: MatDialogRef<PoolCreateDialogComponent>) {
  }

  pool: Pool = { id: 0, name: '', poolMembers: []} ;

  save(): void {
    this.dialogRef.close(this.pool); // Pass data back to the parent
  }


}
