import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { TransportStatusEnum, TransportTypeEnum } from 'src/common/enums/transport.enum';

@JSONSchema({
  title: 'UpdateTransportDto',
  description: 'Data transfer object for updating an existing transport entity',
})
export class UpdateTransportDto {
  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'Vehicle license plate', example: 'AA1234BB' })
  readonly licensePlate?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @JSONSchema({ description: 'Price per kilometer in EUR', example: 0.55 })
  readonly pricePerKmEUR?: number;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'Vehicle model', example: 'Mercedes-Benz Actros' })
  readonly model?: string;

  @IsEnum(TransportTypeEnum)
  @IsOptional()
  @JSONSchema({
    description: 'Type of transport',
    enum: Object.values(TransportTypeEnum),
  })
  readonly type?: TransportTypeEnum;

  @IsEnum(TransportStatusEnum)
  @IsOptional()
  @JSONSchema({
    description: 'Current status of the transport',
    enum: Object.values(TransportStatusEnum),
  })
  readonly status?: TransportStatusEnum;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @JSONSchema({ description: 'Cargo capacity in kilograms', example: 22000 })
  readonly capacity?: number;
}
