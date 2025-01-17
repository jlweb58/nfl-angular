export class WeeklyTeamScore {

  winCount: number;
  lossCount: number;
  tieCount: number;

  constructor(winCount: number, lossCount: number, tieCount: number) {
    this.winCount = winCount;
    this.lossCount = lossCount;
    this.tieCount = tieCount;
  }

  public toString(): string {
    return "(" + this.winCount + "-" + this.lossCount + "-" + this.tieCount + ")";
  }
}
