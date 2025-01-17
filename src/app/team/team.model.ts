import {WeeklyTeamScore} from '../core/models/weekly-team-score.model';
import {Stadium} from '../core/models/stadium.model';

export interface Team {

  id: number;
  name: string;
  abbreviation: string;
  city: string
  weeklyTeamScore: WeeklyTeamScore;
  homeStadium: Stadium|null;
}
