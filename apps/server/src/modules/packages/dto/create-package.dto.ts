import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({ description: '套餐名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '主图URL数组 (JSON)' })
  @IsOptional()
  @IsString()
  mainImages?: string;

  @ApiPropertyOptional({ description: '价格' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '包含商品ID列表' })
  @IsOptional()
  @IsArray()
  productIds?: string[];

  @ApiPropertyOptional({ description: '适配车型ID列表' })
  @IsOptional()
  @IsArray()
  carModelIds?: string[];
}

export class UpdatePackageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mainImages?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  productIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  carModelIds?: string[];
}
