import { SchemaRegistry } from '@skwinnik/schema-registry-client/registry.class';
import {
  TaskAssignedV1Event,
  TaskAssignedV1EventSchema,
} from './tasks/events/taskAssigned.v1.event';
import {
  TaskCompletedV1Event,
  TaskCompletedV1EventSchema,
} from './tasks/events/taskCompleted.v1';
import {
  TaskCreatedV1Event,
  TaskCreatedV1EventSchema,
} from './tasks/events/taskCreated.v1.event';
import {
  TaskUpdatedV1Event,
  TaskUpdatedV1EventSchema,
} from './tasks/events/taskUpdated.v1.event';

export async function registerEvents(schemaRegistry: SchemaRegistry) {
  const promises = [
    schemaRegistry.register(
      TaskCreatedV1Event.EVENT_NAME,
      TaskCreatedV1Event.VERSION,
      TaskCreatedV1EventSchema,
    ),
    schemaRegistry.register(
      TaskAssignedV1Event.EVENT_NAME,
      TaskAssignedV1Event.VERSION,
      TaskAssignedV1EventSchema,
    ),
    schemaRegistry.register(
      TaskCompletedV1Event.EVENT_NAME,
      TaskCompletedV1Event.VERSION,
      TaskCompletedV1EventSchema,
    ),
    schemaRegistry.register(
      TaskUpdatedV1Event.EVENT_NAME,
      TaskUpdatedV1Event.VERSION,
      TaskUpdatedV1EventSchema,
    ),
  ];

  await Promise.all(promises);
}
