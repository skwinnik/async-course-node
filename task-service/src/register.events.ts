import { SchemaRegistry } from '@skwinnik/schema-registry-client/dist/registry.class';
import {
  TaskAssignedV1Event,
  TaskAssignedV1EventSchema,
  TaskCompletedV1Event,
  TaskCompletedV1EventSchema,
  TaskCreatedV1Event,
  TaskCreatedV1EventSchema,
  TaskUpdatedV1Event,
  TaskUpdatedV1EventSchema,
} from '@skwinnik/schema-registry-events';

export async function registerEvents(schemaRegistry: SchemaRegistry) {
  const promises = [
    schemaRegistry.register<TaskCreatedV1Event>(
      TaskCreatedV1Event.EVENT_NAME,
      TaskCreatedV1Event.VERSION,
      TaskCreatedV1EventSchema,
    ),
    schemaRegistry.register<TaskAssignedV1Event>(
      TaskAssignedV1Event.EVENT_NAME,
      TaskAssignedV1Event.VERSION,
      TaskAssignedV1EventSchema,
    ),
    schemaRegistry.register<TaskCompletedV1Event>(
      TaskCompletedV1Event.EVENT_NAME,
      TaskCompletedV1Event.VERSION,
      TaskCompletedV1EventSchema,
    ),
    schemaRegistry.register<TaskUpdatedV1Event>(
      TaskUpdatedV1Event.EVENT_NAME,
      TaskUpdatedV1Event.VERSION,
      TaskUpdatedV1EventSchema,
    ),
  ];

  await Promise.all(promises);
}
