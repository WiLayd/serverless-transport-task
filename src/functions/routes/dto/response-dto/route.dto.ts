import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { BaseDto } from 'src/common/dto/base.dto';
import { RouteStatusEnum } from 'src/common/enums/route.enum';
import { TransportTypeEnum } from 'src/common/enums/transport.enum';
import { RouteItemType } from 'src/functions/routes/types/route.type';

export class RouteDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @JSONSchema({ type: 'string' })
  readonly startCity: string;

  @IsString()
  @IsNotEmpty()
  @JSONSchema({ type: 'string' })
  readonly endCity: string;

  @IsNumber()
  @IsPositive()
  @JSONSchema({ type: 'number' })
  readonly distanceKm: number;

  @IsISO8601()
  @JSONSchema({ type: 'string' })
  readonly dispatchDate: string;

  @IsOptional()
  @JSONSchema({ type: 'string', nullable: true })
  readonly completionDate?: string;

  @IsEnum(TransportTypeEnum)
  @JSONSchema({
    enum: Object.values(TransportTypeEnum),
  })
  readonly requiredTransportType: TransportTypeEnum;

  @IsNumber()
  @IsPositive()
  @JSONSchema({ type: 'number' })
  readonly expectedRevenueUSD: number;

  @IsOptional()
  @IsUUID()
  @JSONSchema({ nullable: true })
  readonly transportId?: string;

  @IsEnum(RouteStatusEnum)
  @JSONSchema({ enum: Object.values(RouteStatusEnum) })
  readonly status: RouteStatusEnum;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @JSONSchema({
    description: 'Calculated cost of the trip in EUR',
    example: 270.5,
  })
  readonly costEUR?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @JSONSchema({
    description: 'Calculated cost of the trip in USD',
    example: 295.25,
  })
  readonly costUSD?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @JSONSchema({
    description: 'Calculated cost of the trip in UAH',
    example: 11850.75,
  })
  readonly costUAH?: number;

  constructor(data: RouteItemType) {
    super(data);

    this.startCity = data.startCity;
    this.endCity = data.endCity;
    this.distanceKm = data.distanceKm;
    this.dispatchDate = data.dispatchDate;
    this.completionDate = data.completionDate ?? undefined;
    this.requiredTransportType = data.requiredTransportType;
    this.expectedRevenueUSD = data.expectedRevenueUSD;
    this.transportId = data.transportId ?? undefined;
    this.status = data.status;
    this.costEUR = data.costEUR ?? undefined;
    this.costUSD = data.costUSD ?? undefined;
    this.costUAH = data.costUAH ?? undefined;
  }
}
