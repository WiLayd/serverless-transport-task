import { IsEnum, IsISO8601, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { RouteStatusEnum } from 'src/common/enums/route.enum';
import { TransportTypeEnum } from 'src/common/enums/transport.enum';

@JSONSchema({
  title: 'UpdateRouteDto',
  description: 'Data transfer object for updating an existing route',
})
export class UpdateRouteDto {
  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'The starting city of the route', example: 'Kyiv' })
  readonly startCity?: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'The ending city of the route', example: 'Odesa' })
  readonly endCity?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @JSONSchema({ description: 'Total distance of the route in kilometers', example: 475 })
  readonly distanceKm?: number;

  @IsISO8601({ strict: true })
  @IsOptional()
  @JSONSchema({
    description: 'The planned dispatch date in ISO 8601 format',
    example: '2025-11-21T10:00:00Z',
  })
  readonly dispatchDate?: string;

  @IsISO8601({ strict: true })
  @IsOptional()
  @JSONSchema({
    description: 'The actual completion date in ISO 8601 format',
    example: '2025-11-22T18:00:00Z',
    nullable: true,
  })
  readonly completionDate?: string | null;

  @IsEnum(TransportTypeEnum)
  @IsOptional()
  @JSONSchema({
    description: 'The required type of transport for this route',
    enum: Object.values(TransportTypeEnum),
  })
  readonly requiredTransportType?: TransportTypeEnum;

  @IsEnum(RouteStatusEnum)
  @IsOptional()
  @JSONSchema({
    description: 'The current status of the route',
    enum: Object.values(RouteStatusEnum),
  })
  readonly status?: RouteStatusEnum;

  @IsNumber()
  @IsOptional()
  @JSONSchema({
    description: 'The expected revenue of the route in USD',
    type: 'number',
  })
  readonly expectedRevenueUSD?: number;
}
