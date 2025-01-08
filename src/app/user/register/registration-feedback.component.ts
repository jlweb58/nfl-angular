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
  templateUrl: './registration-feedback.component.html',
  styleUrls: ['./registration-feedback.component.css'],

})
  export class RegistrationFeedbackComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string; message: string}) {
    }
}
