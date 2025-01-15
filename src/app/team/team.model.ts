import {WeeklyTeamScore} from '../core/models/weekly-team-score.model';

export class Team {

  id: number;
  name: string;
  abbreviation: string;
  city: string
  weeklyTeamScore: WeeklyTeamScore;

  constructor(id: number, name: string, abbreviation: string, city: string, weeklyTeamScore: WeeklyTeamScore) {
    this.id = id;
    this.name = name;
    this.abbreviation = abbreviation;
    this.city = city;
    this.weeklyTeamScore = weeklyTeamScore;
  }

  public static getFormattedWeeklyTeamScore(weeklyTeamScore: WeeklyTeamScore): string {
    return "(" + weeklyTeamScore.winCount + "-" + weeklyTeamScore.lossCount + "-" + weeklyTeamScore.tieCount + ")";

  }


}
