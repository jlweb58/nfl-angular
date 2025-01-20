import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {GameComponent} from './game.component';
import {LoggerService} from '../core/services/logger.service';
import {GameService} from '../core/services/game.service';
import {WeeklyGameSelectionService} from '../core/services/weekly-game-selection.service';
import {MatDialog} from '@angular/material/dialog';
import {TokenStorageService} from '../core/services/token-storage.service';
import {DateTimeService} from '../core/services/date-time.service';
import {SeasonWeekService} from '../season/season-week.service';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {DateTime} from 'luxon';
import {Game} from './game.model';
import {Team} from '../team/team.model';
import {User} from '../user/user.model';
import {PlayerStatus} from '../user/player-status.model';
import {WeeklyGameSelection} from '../core/models/weekly-game-selection.model';
import {normalizeExtraEntryPoints} from '@angular-devkit/build-angular/src/tools/webpack/utils/helpers';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameService: jasmine.SpyObj<GameService>;
  let weeklyGameSelectionService: jasmine.SpyObj<WeeklyGameSelectionService>;
  let tokenStorageService: jasmine.SpyObj<TokenStorageService>;
  let dateTimeService: jasmine.SpyObj<DateTimeService>;
  let seasonWeekService: jasmine.SpyObj<SeasonWeekService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let currentTimeSubject: BehaviorSubject<DateTime>;
  let currentGameWeekSubject: BehaviorSubject<number>;

  // Sample test data
  const mockTeam1 = {id: 1, name: 'Team 1'} as Team;
  const mockTeam2 = {id: 2, name: 'Team 2'} as Team;
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
    currentTimeSubject = new BehaviorSubject<DateTime>(DateTime.now());
    currentGameWeekSubject = new BehaviorSubject<number>(1);
    // Create spies for all services
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    const gameSpy = jasmine.createSpyObj('GameService', ['getGamesForYearAndWeek']);
    const weeklyGameSpy = jasmine.createSpyObj('WeeklyGameSelectionService',
      ['getAllForCurrentUser', 'setWeeklyGameSelection']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const tokenSpy = jasmine.createSpyObj('TokenStorageService', ['getUser']);
    const dateTimeSpy = jasmine.createSpyObj('DateTimeService',
      ['refreshDateTime'], {currentDateTime$: currentTimeSubject.asObservable()});
    const seasonWeekSpy = jasmine.createSpyObj('SeasonWeekService',
      ['refreshCurrentGameWeek'], {currentGameWeek$: currentGameWeekSubject.asObservable()});

    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        {provide: LoggerService, useValue: loggerSpy},
        {provide: GameService, useValue: gameSpy},
        {provide: WeeklyGameSelectionService, useValue: weeklyGameSpy},
        {provide: MatDialog, useValue: dialogSpy},
        {provide: TokenStorageService, useValue: tokenSpy},
        {provide: DateTimeService, useValue: dateTimeSpy},
        {provide: SeasonWeekService, useValue: seasonWeekSpy}
      ]
    }).compileComponents();

    gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
    weeklyGameSelectionService = TestBed.inject(WeeklyGameSelectionService) as jasmine.SpyObj<WeeklyGameSelectionService>;
    tokenStorageService = TestBed.inject(TokenStorageService) as jasmine.SpyObj<TokenStorageService>;
    dateTimeService = TestBed.inject(DateTimeService) as jasmine.SpyObj<DateTimeService>;
    seasonWeekService = TestBed.inject(SeasonWeekService) as jasmine.SpyObj<SeasonWeekService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    // Setup default return values
    gameService.getGamesForYearAndWeek.and.returnValue(of([mockGame]));
    weeklyGameSelectionService.getAllForCurrentUser.and.returnValue(of([]));
    tokenStorageService.getUser.and.returnValue({playerStatus: PlayerStatus.ACTIVE} as User);
    dialogSpy.open.and.returnValue({afterClosed: () => of(true)});

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load games on init', () => {
    expect(gameService.getGamesForYearAndWeek).toHaveBeenCalledWith(2024, 1);
    expect(component.games).toEqual([mockGame]);
  });

  it('should handle week navigation', () => {
    component.nextWeek();
    expect(component.weekToDisplay).toBe(2);
    expect(gameService.getGamesForYearAndWeek).toHaveBeenCalledWith(2024, 2);

    component.previousWeek();
    expect(component.weekToDisplay).toBe(1);
    expect(gameService.getGamesForYearAndWeek).toHaveBeenCalledWith(2024, 1);
  });

  it('should prevent navigation beyond week limits', () => {
    component.weekToDisplay = 1;
    component.previousWeek();
    expect(component.weekToDisplay).toBe(1);

    component.weekToDisplay = 18;
    component.nextWeek();
    expect(component.weekToDisplay).toBe(18);
  });

  it('should handle keyboard navigation', () => {
    const leftArrowEvent = new KeyboardEvent('keyup', {key: 'ArrowLeft'});
    const rightArrowEvent = new KeyboardEvent('keyup', {key: 'ArrowRight'});

    component.handleKeyboardEvent(rightArrowEvent);
    expect(component.weekToDisplay).toBe(2);

    component.handleKeyboardEvent(leftArrowEvent);
    expect(component.weekToDisplay).toBe(1);
  });

  it('should check if game is pickable', (done) => {
    mockGame.startTime = DateTime.fromISO('2024-10-05T17:00:00.00Z');
    mockGame.week = 1;
    const currentTime = DateTime.fromISO('2024-10-05T12:00:00.00Z');
    currentGameWeekSubject.next(1);
    currentTimeSubject.next(currentTime)

    component.isGameAndTeamPickable(mockGame, mockTeam1).subscribe({
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
    tokenStorageService.getUser.and.returnValue({playerStatus: PlayerStatus.ELIMINATED} as User);

    component.isGameAndTeamPickable(mockGame, mockTeam1).subscribe(result => {
      expect(result).toBeFalse();
    });
  });

  it('should set weekly player pick', fakeAsync(() => {
    weeklyGameSelectionService.setWeeklyGameSelection.and.returnValue(of({}));

    component.setWeeklyPlayerPick(mockGame, mockTeam1);
    tick();

    expect(weeklyGameSelectionService.setWeeklyGameSelection)
      .toHaveBeenCalledWith(mockGame, mockTeam1);
    expect(dialog.open).toHaveBeenCalled();
  }));

  it('should not be pickable after current game week', (done) => {
    mockGame.startTime = DateTime.fromISO('2024-10-06T17:00:00.00Z');
    mockGame.week = 3;
    const currentTime = DateTime.fromISO('2024-09-05T18:00:00.00Z'); // 1 hour after game
    currentGameWeekSubject.next(1);
    currentTimeSubject.next(currentTime);

    component.isGameAndTeamPickable(mockGame, mockTeam1)
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
    currentTimeSubject.next(currentTime);

    component.isGameAndTeamPickable(mockGame, mockTeam1)
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
    currentTimeSubject.next(currentTime);

    // Add a previous selection for this team
    component.weeklyGameSelectionsForUser = [{
      week: 2,
      winningTeamSelection: mockTeam1
    } as WeeklyGameSelection];

    component.isGameAndTeamPickable(mockGame, mockTeam1)
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
    currentGameWeekSubject.next(0);
    currentTimeSubject.next(currentTime);
    tick();

    component.isGameAndTeamPickable(mockGame, mockTeam1)
      .subscribe(result => {
        expect(result).toBeTrue();
      });
    tick();
  }));

  it('should not be pickable if we are before week 1 and the pick is for week 2', fakeAsync(() => {

    mockGame.week = 2;
    const currentTime = DateTime.fromISO('2024-09-01T18:00:00.00Z'); // 1 hour after game
    currentGameWeekSubject.next(0);
    currentTimeSubject.next(currentTime);
    tick();

    component.isGameAndTeamPickable(mockGame, mockTeam1)
      .subscribe(result => {
        expect(result).toBeFalse();
      });
    tick();

  }));

});
