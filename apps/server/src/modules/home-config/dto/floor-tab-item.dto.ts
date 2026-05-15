import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, ArrayMinSize } from 'class-validator';

export class CreateFloorTabItemDto {
  @ApiProperty({ description: '选块ID' })
  @IsString()
  floorTabId: string;

  @ApiProperty({ description: '类型: product / package' })
  @IsString()
  itemType: string;

  @ApiProperty({ description: '商品或套餐ID' })
  @IsString()
  itemId: string;

  @ApiPropertyOptional({ description: '排序（越小越靠前）' })
  @IsOptional()
  @IsNumber()
  sort?: number;
}

export class UpdateFloorTabItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  itemType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  itemId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort?: number;
}

export class BatchReplaceFloorTabItemsDto {
  @ApiProperty({ description: '选块ID' })
  @IsString()
  floorTabId: string;

  @ApiProperty({ description: '推荐项列表（全量覆盖）' })
  @IsArray()
  @ArrayMinSize(1)
  items: Array<{
    itemType: string;
    itemId: string;
    sort?: number;
  }>;
}
