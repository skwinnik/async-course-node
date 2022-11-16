import { Inject, Injectable, Scope } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable({ scope: Scope.DEFAULT })
export default class SchemaRegistryClient {
  private schemaCache: { [key: string]: string } = {};

  constructor(
    @Inject('SCHEMA_REGISTRY_URL') private schemaRegistryUrl: string,
    private httpService: HttpService,
  ) {}

  public async getSchema(name: string, version: number): Promise<string> {
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
    this.schemaCache[`${name}-${version}`] = schema;
    
    return schema;
  }

  public async registerSchema(
    name: string,
    version: number,
    json: string,
  ): Promise<void> {
    if (this.getSchema(name, version) !== undefined) {
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
}
