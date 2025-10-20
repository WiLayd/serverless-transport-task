import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class DynamoPaginationDto {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  @IsInt()
  @Min(1)
  @JSONSchema({ default: 10 })
  limit?: number;

  @IsOptional()
  @IsString()
  @JSONSchema({})
  lastEvaluatedKey?: string;
}
