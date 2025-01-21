import {Pipe, PipeTransform} from '@angular/core';
import {WeeklyTeamScore} from '../models/weekly-team-score.model';

@Pipe({
  name: 'weeklyTeamScore'
})
export class WeeklyTeamScorePipe implements PipeTransform {
  transform(score: WeeklyTeamScore): string {
    if (!score) { return '';}
    return `(${score.winCount}-${score.lossCount}-${score.tieCount})`;
  }
}
