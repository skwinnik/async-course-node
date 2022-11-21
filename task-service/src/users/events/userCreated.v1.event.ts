import { JSONSchemaType } from 'ajv';

export class UserCreatedV1Event {
  public static EVENT_NAME = 'userCreated';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
    public readonly roleId: number,
    public readonly name: string,
  ) {}
}