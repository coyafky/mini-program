import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: '商品名称' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ description: '主图URL数组 (JSON)' })
  @IsOptional()
  @IsString()
  mainImages?: string;

  @ApiPropertyOptional({ description: '价格说明' })
  @IsOptional()
  @IsString()
  priceDescription?: string;

  @ApiPropertyOptional({ description: '简要介绍' })
  @IsOptional()
  @IsString()
  brief?: string;

  @ApiPropertyOptional({ description: '详细介绍' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '规格说明' })
  @IsOptional()
  @IsString()
  specifications?: string;

  @ApiPropertyOptional({ description: '分类: interior/exterior/function/comfort' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: '适配车型ID列表' })
  @IsOptional()
  @IsArray()
  carModelIds?: string[];
}

export class UpdateProductDto {
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
  @IsString()
  priceDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brief?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specifications?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  carModelIds?: string[];
}
