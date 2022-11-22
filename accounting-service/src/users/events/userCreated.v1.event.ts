export class UserCreatedV1Event {
  constructor(
    public readonly id: number,
    public readonly roleId: number,
    public readonly name: string,
  ) {}
}
