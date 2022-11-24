import {
  UserCreatedV1Event,
  UserCreatedV1EventSchema,
  UserUpdatedV1Event,
  UserUpdatedV1EventSchema,
  UserDeletedV1Event,
  UserDeletedV1EventSchema,
  RoleCreatedV1Event,
  RoleCreatedV1EventSchema,
  RoleUpdatedV1Event,
  RoleUpdatedV1EventSchema,
  RoleDeletedV1Event,
  RoleDeletedV1EventSchema,
} from '@skwinnik/schema-registry-events';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/dist/registry.class';

export async function registerEvents(schemaRegistry: SchemaRegistry) {
  const promises = [
    schemaRegistry.register<UserCreatedV1Event>(
      UserCreatedV1Event.EVENT_NAME,
      UserCreatedV1Event.VERSION,
      UserCreatedV1EventSchema,
    ),
    schemaRegistry.register<UserUpdatedV1Event>(
      UserUpdatedV1Event.EVENT_NAME,
      UserUpdatedV1Event.VERSION,
      UserUpdatedV1EventSchema,
    ),
    schemaRegistry.register<UserDeletedV1Event>(
      UserDeletedV1Event.EVENT_NAME,
      UserDeletedV1Event.VERSION,
      UserDeletedV1EventSchema,
    ),

    schemaRegistry.register<RoleCreatedV1Event>(
      RoleCreatedV1Event.EVENT_NAME,
      RoleCreatedV1Event.VERSION,
      RoleCreatedV1EventSchema,
    ),
    schemaRegistry.register<RoleUpdatedV1Event>(
      RoleUpdatedV1Event.EVENT_NAME,
      RoleUpdatedV1Event.VERSION,
      RoleUpdatedV1EventSchema,
    ),
    schemaRegistry.register<RoleDeletedV1Event>(
      RoleDeletedV1Event.EVENT_NAME,
      RoleDeletedV1Event.VERSION,
      RoleDeletedV1EventSchema,
    ),
  ];

  return Promise.all(promises);
}
