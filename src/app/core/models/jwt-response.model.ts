export class JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  roles: string[];

  constructor() {
    this.type = 'Bearer';
    this.token = '';
    this.id = 0;
    this.username = '';
    this.roles = [];
  }
}
