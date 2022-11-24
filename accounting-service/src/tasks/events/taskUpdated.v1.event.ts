export class TaskUpdatedV1Event {
  public static EVENT_NAME = 'task.updated';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly name: string,
    public readonly status: string,
  ) {}
}
