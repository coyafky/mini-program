import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, MinLength } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ description: '位置: TOP / MIDDLE' })
  @IsString()
  position: string;

  @ApiPropertyOptional({ description: '标题' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '图片URL' })
  @IsString()
  @MinLength(1)
  imageUrl: string;

  @ApiPropertyOptional({ description: '跳转链接' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ description: '排序（越小越靠前）' })
  @IsOptional()
  @IsNumber()
  sort?: number;
}

export class UpdateBannerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  status?: number;
}
