import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { BaseDto } from 'src/common/dto/base.dto';
import { TransportTypeEnum } from 'src/common/enums/transport.enum';
import { TransportItemType } from 'src/functions/transport/types/transport.type';

export class TransportDto extends BaseDto {
  @IsString()
  @JSONSchema({ type: 'string' })
  readonly licensePlate: string;

  @IsString()
  @JSONSchema({ type: 'string' })
  readonly status: string;

  @IsString()
  @JSONSchema({ type: 'number' })
  readonly pricePerKmEUR: number;

  @IsString()
  @IsOptional()
  @JSONSchema({ type: 'string' })
  readonly model?: string;

  @IsEnum(TransportTypeEnum)
  @JSONSchema({ enum: Object.values(TransportTypeEnum) })
  readonly type: TransportTypeEnum;

  @IsNumber()
  @JSONSchema({ type: 'number' })
  readonly capacity: number;

  constructor(data: TransportItemType) {
    super(data);
    this.licensePlate = data.licensePlate;
    this.model = data.model;
    this.type = data.type as TransportTypeEnum;
    this.capacity = data.capacity;
    this.status = data.status;
    this.pricePerKmEUR = data.pricePerKmEUR;
  }
}
