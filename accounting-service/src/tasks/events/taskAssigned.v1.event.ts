export class TaskAssignedV1Event {
  public static EVENT_NAME = 'task.assigned';
  public static VERSION = 1;

  constructor(public readonly id: number, public readonly userId: number) {}
}


