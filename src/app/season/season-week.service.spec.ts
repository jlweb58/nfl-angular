import { TestBed } from '@angular/core/testing';

import { SeasonWeekService } from './season-week.service';

describe('SeasonWeekService', () => {
  let service: SeasonWeekService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeasonWeekService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
