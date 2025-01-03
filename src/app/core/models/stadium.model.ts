export class Stadium {
  id: number;
  espnId: number;
  name: string;
  zoneId: string;

  constructor(id: number, espnId: number, name: string, zoneId: string) {
    this.id = id;
    this.espnId = espnId;
    this.name = name;
    this.zoneId = zoneId;
  }
}
