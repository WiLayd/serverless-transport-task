import { IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { TransportTypeEnum } from 'src/common/enums/transport.enum';

@JSONSchema({
  title: 'CreateRouteDto',
  description: 'Data transfer object for creating a new route',
})
export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  @JSONSchema({ description: 'The starting city of the route', example: 'Kyiv' })
  readonly startCity: string;

  @IsString()
  @IsNotEmpty()
  @JSONSchema({ description: 'The ending city of the route', example: 'Lviv' })
  readonly endCity: string;

  @IsNumber()
  @IsPositive()
  @JSONSchema({ description: 'Total distance of the route in kilometers', example: 540 })
  readonly distanceKm: number;

  @IsString()
  @IsNotEmpty()
  @JSONSchema({ description: 'The expected revenue of the route in USD', example: '1000' })
  readonly expectedRevenueUSD: number;

  @IsISO8601({ strict: true })
  @JSONSchema({
    description: 'The planned dispatch date in ISO 8601 format',
    example: '2025-11-20T09:00:00Z',
  })
  readonly dispatchDate: string;

  @IsEnum(TransportTypeEnum)
  @JSONSchema({
    description: 'The required type of transport for this route',
    enum: Object.values(TransportTypeEnum),
    example: TransportTypeEnum.TRUCK,
  })
  readonly requiredTransportType: TransportTypeEnum;
}
