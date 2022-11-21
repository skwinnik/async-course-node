import { JSONSchemaType } from 'ajv';

export class UserUpdatedV1Event {
  public static EVENT_NAME = 'userUpdated';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
    public readonly roleId: number,
    public readonly name: string,
  ) {}
}
