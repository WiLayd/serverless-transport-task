import { IsString, IsNotEmpty } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class BaseDto {
  @IsString()
  @IsNotEmpty()
  @JSONSchema({ type: 'string' })
  readonly id: string;

  @IsNotEmpty()
  @JSONSchema({ type: 'string' })
  readonly createdAt: string;

  constructor(data: any) {
    this.id = data.id;
    this.createdAt = data.createdAt;
  }
}
