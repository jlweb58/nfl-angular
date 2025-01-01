import {DateTime} from 'luxon';
import {Team} from './team.model';

export class Game {

  id: number;
  espnId: number;
  startTime: DateTime;
  homeTeam: Team;
  awayTeam: Team;
  week: number;
  year: number;
  homePoints: number;
  awayPoints: number;
  pointSpread: number;


  constructor(id: number, espnId: number, gameStartingTime: DateTime, homeTeam: Team, awayTeam: Team, week: number, year: number, homePoints: number, awayPoints: number, pointSpread: number) {
    this.id = id;
    this.espnId = espnId;
    this.startTime = gameStartingTime;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.week = week;
    this.year = year;
    this.homePoints = homePoints;
    this.awayPoints = awayPoints;
    this.pointSpread = pointSpread;
  }
}
