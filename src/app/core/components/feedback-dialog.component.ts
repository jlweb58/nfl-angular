import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-feedback-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
  export class FeedbackDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string; message: string}) {
    }
}
