import {DateTime} from 'luxon';
import {Team} from '../team/team.model';
import {Stadium} from '../core/models/stadium.model';

export interface Game {

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
  venue: Stadium;
  finished: boolean;
}
