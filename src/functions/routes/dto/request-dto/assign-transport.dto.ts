import { IsNotEmpty, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

@JSONSchema({ title: 'AssignTransportDto' })
export class AssignTransportDto {
  @IsUUID('4')
  @IsNotEmpty()
  @JSONSchema({ description: 'ID of the transport to assign', format: 'uuid' })
  readonly transportId: string;
}
