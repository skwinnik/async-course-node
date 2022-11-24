export class LoggedInDto {
  constructor(
    public id: string,
    public name: string,
    public role: string,
    public access_token: string
  ) {}
}
