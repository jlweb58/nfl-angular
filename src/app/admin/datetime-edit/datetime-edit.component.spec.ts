import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimeEditComponent } from './datetime-edit.component';

describe('DatetimeEditComponent', () => {
  let component: DatetimeEditComponent;
  let fixture: ComponentFixture<DatetimeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatetimeEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatetimeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
