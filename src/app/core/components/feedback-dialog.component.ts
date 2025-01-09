import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-pick-feedback-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './pick-feedback.component.html',
  styleUrls: ['./pick-feedback.component.css'],

})
  export class PickFeedbackComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string; message: string}) {
    }
}
