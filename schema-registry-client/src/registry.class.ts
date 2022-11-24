import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export class SchemaRegistry {
  private schemaCache: { [key: string]: string } = {};
  private ajv: Ajv;
  constructor(
    @Inject('SCHEMA_REGISTRY_URL') private schemaRegistryUrl: string,
    private httpService: HttpService,
  ) {
    this.ajv = new Ajv();
    addFormats(this.ajv);
  }

  private async getSchema(name: string, version: number): Promise<string | undefined> {
    if (this.schemaCache[`${name}-${version}`] !== undefined) {
      return this.schemaCache[`${name}-${version}`];
    }
    var response = await firstValueFrom(
      this.httpService.get(
        `${this.schemaRegistryUrl}/schema/${name}/${version}`,
      ),
    );

    if (response.status !== 200) {
      throw new Error(
        `Error getting schema: ${name} - ${version}: ${response.status}`,
      );
    }

    const schema = response.data.json as string;
    if (schema === null || schema === undefined) return;

    this.schemaCache[`${name}-${version}`] = schema;
    return schema;
  }

  private async registerSchema(
    name: string,
    version: number,
    json: string,
  ): Promise<void> {
    if (await this.getSchema(name, version)) {
      console.log(`Schema ${name} - ${version} already exists`);
      return;
    }

    const payload = { name, version, json };
    var response = await firstValueFrom(
      this.httpService.post(`${this.schemaRegistryUrl}/schema`, payload, {
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    if (response.status !== 201) {
      throw new Error(
        `Error registering schema: ${name} - ${version}: ${response.status}`,
      );
    }

    console.log(`Schema ${name} - ${version} registered`);
    return;
  }

  public async serialize<T>(name: string, version: number, object: T) {
    const stringSchema = await this.getSchema(name, version);
    if (!stringSchema) {
      throw new Error(`Schema ${name} - ${version} not found`);
    }
    const schema = JSON.parse(stringSchema) as JSONSchemaType<T>;
    const validate = this.ajv.compile(schema);

    if (validate(object)) return JSON.stringify(object);
    else throw new Error(`Invalid payload: ${JSON.stringify(validate.errors)}`);
  }

  public async deserialize<T>(
    name: string,
    version: number,
    payload: string,
  ): Promise<T> {
    const stringSchema = await this.getSchema(name, version);
    if (!stringSchema) {
      throw new Error(`Schema ${name} - ${version} not found`);
    }
    const schema = JSON.parse(stringSchema) as JSONSchemaType<T>;
    const validate = this.ajv.compile(schema);

    const json = JSON.parse(payload);
    if (validate(json)) return json as T;
    else throw new Error(`Invalid payload: ${JSON.stringify(validate.errors)}`);
  }

  public async register<T>(
    name: string,
    version: number,
    schema: JSONSchemaType<T>,
  ) {
    await this.registerSchema(name, version, JSON.stringify(schema));
  }
}
