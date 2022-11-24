export class TaskCompletedV1Event {
  public static EVENT_NAME = 'task.completed';
  public static VERSION = 1;

  constructor(public readonly id: number, public readonly userId: number) {}
}
