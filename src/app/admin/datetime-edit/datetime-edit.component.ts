import {ChangeDetectionStrategy, Component, NgZone} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {DateTime} from 'luxon';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatButton} from '@angular/material/button';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {DateTimeService} from '../../core/services/date-time.service';
import {MatDialog} from '@angular/material/dialog';
import {FeedbackDialog} from '../../core/components/feedback-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-datetime-edit',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatDatepickerInput,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatTimepickerModule,
    MatButton,
  ],
  providers: [
    provideNativeDateAdapter(),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datetime-edit.component.html',
  styleUrl: './datetime-edit.component.css'
})
export class DatetimeEditComponent {
  dateControl = new FormControl();
  timeControl = new FormControl();

  constructor(private dateTimeService: DateTimeService, private router: Router,
              private dialog: MatDialog, private zone: NgZone) {
  }

  setDateTime(): void {
    const date = this.dateControl.value;
    const time = this.timeControl.value;

    if (date) {
      date.setHours(time.getHours());
      date.setMinutes(time.getMinutes());

        this.dateTimeService.setDateTime(DateTime.fromJSDate(date).setZone('UTC')).subscribe({
            next: (response) => {
              console.log(response);
              this.dialog.open(FeedbackDialog, {
                data: {
                  title: 'Date/Time set',
                  message: 'The date and time were successfully changed: ' + response,
                }, panelClass: 'custom-dialog-container',
              }).afterClosed().subscribe(() => {
                this.router.navigate(['/games'])
              });
            },
            error: (error) => {
              this.dialog.open(FeedbackDialog, {
                data: {
                  title: 'Setting date/time failed',
                  message: 'The date and time couldn\'t be changed because ' + error.message,
                }, panelClass: 'custom-dialog-container',
              });
            },
          }
        );

    }
  }
}
