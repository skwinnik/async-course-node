import { JSONSchemaType } from 'ajv';

export class UserDeletedV1Event {
  public static EVENT_NAME = 'userDeleted';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
  ) {}
}

