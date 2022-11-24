import { SchemaRegistry } from '@skwinnik/schema-registry-client/dist/registry.class';
import {
  TaskPriceCreatedV1Event,
  TaskPriceCreatedV1EventSchema,
  TransactionCreatedV1Event,
  TransactionCreatedV1EventSchema,
  TransactionPeriodCreatedV1Event,
  TransactionPeriodCreatedV1EventSchema,
  TransactionPeriodUpdatedV1Event,
  TransactionPeriodUpdatedV1EventSchema,
} from '@skwinnik/schema-registry-events';

export async function registerEvents(schemaRegistry: SchemaRegistry) {
  await Promise.all([
    schemaRegistry.register<TaskPriceCreatedV1Event>(
      TaskPriceCreatedV1Event.EVENT_NAME,
      TaskPriceCreatedV1Event.VERSION,
      TaskPriceCreatedV1EventSchema,
    ),
    schemaRegistry.register<TransactionCreatedV1Event>(
      TransactionCreatedV1Event.EVENT_NAME,
      TransactionCreatedV1Event.VERSION,
      TransactionCreatedV1EventSchema,
    ),
    schemaRegistry.register<TransactionPeriodCreatedV1Event>(
      TransactionPeriodCreatedV1Event.EVENT_NAME,
      TransactionPeriodCreatedV1Event.VERSION,
      TransactionPeriodCreatedV1EventSchema,
    ),
    schemaRegistry.register<TransactionPeriodUpdatedV1Event>(
      TransactionPeriodUpdatedV1Event.EVENT_NAME,
      TransactionPeriodUpdatedV1Event.VERSION,
      TransactionPeriodUpdatedV1EventSchema,
    ),
  ]);
}
