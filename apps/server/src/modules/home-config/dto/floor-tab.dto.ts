import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, MinLength } from 'class-validator';

export class CreateFloorTabDto {
  @ApiProperty({ description: '所属楼层ID' })
  @IsString()
  floorId: string;

  @ApiProperty({ description: '选块名称' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ description: '图片URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ description: '目标类型: product / package / category / brand / url' })
  @IsOptional()
  @IsString()
  targetType?: string;

  @ApiPropertyOptional({ description: '目标ID' })
  @IsOptional()
  @IsString()
  targetId?: string;

  @ApiPropertyOptional({ description: '排序（越小越靠前）' })
  @IsOptional()
  @IsNumber()
  sort?: number;
}

export class UpdateFloorTabDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  status?: number;
}
