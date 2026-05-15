import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, MinLength } from 'class-validator';

export class CreateFloorDto {
  @ApiProperty({ description: '楼层标题' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({ description: '楼层类型: products / feature' })
  @IsOptional()
  @IsString()
  floorType?: string;

  @ApiPropertyOptional({ description: '排序（越小越靠前）' })
  @IsOptional()
  @IsNumber()
  sort?: number;
}

export class UpdateFloorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  floorType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  status?: number;
}
