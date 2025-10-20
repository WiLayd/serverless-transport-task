import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { RouteDto } from 'src/functions/routes/dto/response-dto/route.dto';
import { RouteItemType } from 'src/functions/routes/types/route.type';

export class RouteListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouteDto)
  @JSONSchema({
    description: 'Route list',
    items: { $ref: '#/components/schemas/RouteDto' },
  })
  items: RouteDto[];

  @IsNumber()
  @JSONSchema({ description: 'Total number of items' })
  totalCount: number;

  @IsOptional()
  @IsString()
  @JSONSchema({ description: 'Key to load the next page (base64)' })
  lastEvaluatedKey?: string;

  constructor(data: RouteItemType[], lastEvaluatedKey?: string) {
    this.items = data.map((item) => new RouteDto(item));
    this.lastEvaluatedKey = lastEvaluatedKey;
    this.totalCount = data.length ?? 0;
  }
}
