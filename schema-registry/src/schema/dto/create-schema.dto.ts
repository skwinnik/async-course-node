import { ApiProperty } from "@nestjs/swagger";

export class CreateSchemaDto {
    @ApiProperty({ example: "TaskCreated", description: "The name of the schema" })
    name: string;

    @ApiProperty({ example: 1, description: "The version of the schema" })
    version: number;

    @ApiProperty({ example: { type: "object", properties: { id: { type: "string" } } }, description: "The JSON schema" })
    json: object;
}
