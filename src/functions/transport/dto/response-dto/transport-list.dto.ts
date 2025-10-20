import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { TransportDto } from 'src/functions/transport/dto/response-dto/transport.dto';
import { TransportItemType } from 'src/functions/transport/types/transport.type';

export class TransportListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransportDto)
  @JSONSchema({
    description: 'Transport list',
    items: { $ref: '#/components/schemas/TransportDto' },
  })
  items: TransportDto[];

  @IsNumber()
  @JSONSchema({ description: 'Total number of items' })
  totalCount: number;

  @IsOptional()
  @IsString()
  @JSONSchema({ description: 'Key to load the next page (base64)' })
  lastEvaluatedKey?: string;

  constructor(data: TransportItemType[], lastEvaluatedKey?: string) {
    this.items = data.map((item) => new TransportDto(item));
    this.lastEvaluatedKey = lastEvaluatedKey;
    this.totalCount = data.length ?? 0;
  }
}
