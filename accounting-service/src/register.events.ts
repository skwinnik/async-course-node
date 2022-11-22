import { SchemaRegistry } from '@skwinnik/schema-registry-client/registry.class';
import {
  TaskPriceCreatedV1Event,
  TaskPriceCreatedV1EventSchema,
} from './transactions/events/TaskPriceCreated.v1.event';
import {
  TransactionCreatedV1Event,
  TransactionCreatedV1EventSchema,
} from './transactions/events/TransactionCreated.v1.event';
import {
  TransactionPeriodCreatedV1Event,
  TransactionPeriodCreatedV1EventSchema,
} from './transactions/events/TransactionPeriodCreated.v1.event';
import {
  TransactionPeriodUpdatedV1Event,
  TransactionPeriodUpdatedV1EventSchema,
} from './transactions/events/TransactionPeriodUpdated.v1.event';

export async function registerEvents(schemaRegistry: SchemaRegistry) {
  await Promise.all([
    schemaRegistry.register(
      TaskPriceCreatedV1Event.EVENT_NAME,
      TaskPriceCreatedV1Event.VERSION,
      TaskPriceCreatedV1EventSchema,
    ),
    schemaRegistry.register(
      TransactionCreatedV1Event.EVENT_NAME,
      TransactionCreatedV1Event.VERSION,
      TransactionCreatedV1EventSchema,
    ),
    schemaRegistry.register(
      TransactionPeriodCreatedV1Event.EVENT_NAME,
      TransactionPeriodCreatedV1Event.VERSION,
      TransactionPeriodCreatedV1EventSchema,
    ),
    schemaRegistry.register(
      TransactionPeriodUpdatedV1Event.EVENT_NAME,
      TransactionPeriodUpdatedV1Event.VERSION,
      TransactionPeriodUpdatedV1EventSchema,
    ),
  ]);
}
