import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, MinLength } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ description: '门店名称' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: '门店地址' })
  @IsString()
  address: string;

  @ApiProperty({ description: '联系电话' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: '营业时间' })
  @IsOptional()
  @IsString()
  businessHours?: string;
}

export class UpdateStoreDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessHours?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  status?: number;
}

export class StoreProductConfigDto {
  @ApiProperty({ description: '商品ID列表' })
  productIds: string[];

  @ApiProperty({ description: '套餐ID列表' })
  packageIds: string[];
}
