import { IsArray, IsOptional, IsString } from 'class-validator';

export class PaginationResponseDto {
  @IsArray()
  items: any[];

  @IsOptional()
  @IsString()
  lastEvaluatedKey?: string;
}
