export class User {
  authenticated: boolean;
  name: string;
  roles: string[];

  constructor(name :string) {
    this.name = name;
    this.authenticated = true;
    this.roles = [];
  }
}
