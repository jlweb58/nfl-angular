import {WeeklyTeamScore} from './weekly-team-score.model';

export class Team {

  id: number;
  name: string;
  abbreviation: string;
  weeklyTeamScore: WeeklyTeamScore;

  constructor(id: number, name: string, abbreviation: string, weeklyTeamScore: WeeklyTeamScore) {
    this.id = id;
    this.name = name;
    this.abbreviation = abbreviation;
    this.weeklyTeamScore = weeklyTeamScore;
  }



}
