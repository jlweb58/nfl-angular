import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {GamePickButtonComponent} from './game-pick-button.component';
import {Team} from '../../team/team.model';
import {Game} from '../game.model';
import {DateTime} from 'luxon';
import {of} from 'rxjs';
import {PlayerStatus} from '../../user/player-status.model';
import {WeeklyGameSelection} from '../../core/models/weekly-game-selection.model';

describe('GamePickButtonComponent', () => {
  let component: GamePickButtonComponent;
  let fixture: ComponentFixture<GamePickButtonComponent>;
  let mockDateTime$ = of(DateTime.now());
  let weeklyGameSelectionsForUser: WeeklyGameSelection[] = [];
  let mockActiveGameWeek$ = of(1);

  const mockTeam1 = { id: 1, name: 'Team 1' } as Team;
  const mockTeam2 = { id: 2, name: 'Team 2' } as Team;
  const mockGame: Game = {
    id: 1,
    week: 1,
    espnId: 1,
    year: 2024,
    homePoints: 20,
    awayPoints: 10,
    pointSpread: 0,
    startTime: DateTime.now(),
    homeTeam: mockTeam1,
    awayTeam: mockTeam2,
    venue: {
      id: 1,
      espnId: 1,
      name: 'Venue',
      zoneId: 'America/New_York',
    }
  } as Game;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePickButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePickButtonComponent);
    component = fixture.componentInstance;
    component.game = mockGame;
    component.team = mockTeam1;
    component.currentDateTime$ = mockDateTime$;
    component.activeGameWeek$ = mockActiveGameWeek$;
    component.weeklyGameSelectionsForUser = weeklyGameSelectionsForUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if game is pickable', (done) => {
    mockGame.startTime = DateTime.fromISO('2024-10-05T17:00:00.00Z');
    mockGame.week = 1;
    const currentTime = DateTime.fromISO('2024-10-05T12:00:00.00Z');
    component.currentDateTime$ = of(currentTime);

    component.isGameAndTeamPickable().subscribe({
      next: (result) => {
        expect(result).toBe(true);
        done();
      },
      error: (error) => {
        done.fail(error);
      }
    });
  });

  it('should not allow picks for eliminated players', () => {
    component.userStatus = PlayerStatus.ELIMINATED;
    component.isGameAndTeamPickable().subscribe(result => {
      expect(result).toBeFalse();
    });
  });

  it('should not be pickable after current game week', (done) => {
    mockGame.startTime = DateTime.fromISO('2024-10-06T17:00:00.00Z');
    mockGame.week = 3;
    const currentTime = DateTime.fromISO('2024-09-05T18:00:00.00Z'); // 1 hour after game
    component.currentDateTime$ = of(currentTime);

    component.isGameAndTeamPickable()
      .subscribe({
        next: (result) => {
          expect(result).toBeFalse();
          done();
        },
        error: (error) => {
          done.fail(error);
        }
      });
  });

  it('should not be pickable after game time', (done) => {
    const currentTime = DateTime.fromISO('2024-10-05T18:00:00.00Z'); // 1 hour after game
    mockGame.startTime = DateTime.fromISO('2024-10-05T17:00:00.00Z');
    component.currentDateTime$ = of(currentTime);

    component.isGameAndTeamPickable()
      .subscribe({
        next: (result) => {
          expect(result).toBeFalse();
          done();
        },
        error: (error) => {
          done.fail(error);
        }
      });
  });

  it('should not be pickable if team was already selected', (done) => {
    // Setup game time in future
    const currentTime = DateTime.fromISO('2024-10-05T12:00:00.00Z');
    mockGame.startTime = DateTime.fromISO('2024-10-05T17:00:00.00Z');
    component.currentDateTime$ = of(currentTime);

    // Add a previous selection for this team
    component.weeklyGameSelectionsForUser = [{
      week: 2,
      winningTeamSelection: mockTeam1
    } as WeeklyGameSelection];

    component.isGameAndTeamPickable()
      .subscribe({
        next: (result) => {
          expect(result).toBeFalse();
          done();
        },
        error: (error) => {
          done.fail(error);
        }
      });
  });

  it('should be pickable if we are before week 1 and the pick is for week 1', fakeAsync(() => {

    mockGame.startTime = DateTime.fromISO('2024-09-06T17:00:00.00Z');
    mockGame.week = 1;
    const currentTime = DateTime.fromISO('2024-09-01T18:00:00.00Z'); // 1 hour after game
    component.currentDateTime$ = of(currentTime);
    component.activeGameWeek$ = of(0);
    tick();

    component.isGameAndTeamPickable()
      .subscribe(result => {
        expect(result).toBeTrue();
      });
    tick();
  }));

  it('should not be pickable if we are before week 1 and the pick is for week 2', fakeAsync(() => {

    mockGame.week = 2;
    const currentTime = DateTime.fromISO('2024-09-01T18:00:00.00Z'); // 1 hour after game
    component.currentDateTime$ = of(currentTime);
    component.activeGameWeek$ = of(0);
    tick();

    component.isGameAndTeamPickable()
      .subscribe(result => {
        expect(result).toBeFalse();
      });
    tick();

  }));

});
