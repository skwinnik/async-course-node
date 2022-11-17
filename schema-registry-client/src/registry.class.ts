import { SchemaRegistryClient } from './registry.api';
import Ajv, {JSONSchemaType} from 'ajv';

export class SchemaRegistry {
  private ajv: Ajv;
  constructor(private schemaRegistryClient: SchemaRegistryClient) {
    this.ajv = new Ajv();
  }

  public async serialize<T>(name: string, version: number, object: T) {
    const stringSchema = await this.schemaRegistryClient.getSchema(name, version);
    if (!stringSchema) {
      throw new Error(`Schema ${name} - ${version} not found`);
    }
    const schema = JSON.parse(stringSchema) as JSONSchemaType<any>;
    const validate = await this.ajv.compileAsync(schema);

    if (validate(object))
      return JSON.stringify(object);
    else
      throw new Error(`Invalid payload: ${validate.errors}`);
  }

  public async deserialize<T>(
    name: string,
    version: number,
    payload: string,
  ): Promise<T> {
    const stringSchema = await this.schemaRegistryClient.getSchema(name, version);
    if (!stringSchema) {
      throw new Error(`Schema ${name} - ${version} not found`);
    }
    const schema = JSON.parse(stringSchema) as JSONSchemaType<any>;
    const validate = await this.ajv.compileAsync(schema);
    
    const json = JSON.parse(payload);
    if (validate(json))
      return json as T;
    else
      throw new Error(`Invalid payload: ${validate.errors}`);
  }

  public async register(name: string, version: number, schema: JSONSchemaType<any>) {
    await this.schemaRegistryClient.registerSchema(name, version, JSON.stringify(schema));
  }
}
