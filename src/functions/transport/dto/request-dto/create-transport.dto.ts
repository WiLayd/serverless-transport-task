import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { TransportTypeEnum } from 'src/common/enums/transport.enum';

@JSONSchema({
  title: 'CreateTransportDto',
  description: 'Data transfer object for creating a new transport entity',
})
export class CreateTransportDto {
  @IsString()
  @IsNotEmpty()
  @JSONSchema({ description: 'Vehicle license plate', example: 'AA1234BB' })
  readonly licensePlate: string;

  @IsNumber()
  @IsPositive()
  @JSONSchema({ description: 'Price per kilometer in EUR', example: 0.5 })
  readonly pricePerKmEUR: number;

  @IsString()
  @JSONSchema({ description: 'Vehicle model', example: 'Mercedes-Benz Actros' })
  readonly model: string;

  @IsEnum(TransportTypeEnum)
  @JSONSchema({
    description: 'Type of transport',
    enum: Object.values(TransportTypeEnum),
    example: TransportTypeEnum.TRUCK,
  })
  readonly type: TransportTypeEnum;

  @IsNumber()
  @IsPositive()
  @JSONSchema({ description: 'Cargo capacity in kilograms', example: 20000 })
  readonly capacity: number;
}
