import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ description: '门店ID' })
  @IsString()
  storeId: string;

  @ApiPropertyOptional({ description: '商品ID' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ description: '套餐ID' })
  @IsOptional()
  @IsString()
  packageId?: string;

  @ApiProperty({ description: '手机号' })
  @IsString()
  userPhone: string;

  @ApiProperty({ description: '车型' })
  @IsString()
  carModel: string;

  @ApiProperty({ description: '预约日期' })
  @IsDateString()
  appointmentDate: string;

  @ApiPropertyOptional({ description: '时间段: morning/afternoon/evening' })
  @IsOptional()
  @IsString()
  timeSlot?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateReservationStatusDto {
  @ApiProperty({ description: '状态: pending/contacted/confirmed/completed/closed' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '处理备注' })
  @IsOptional()
  @IsString()
  handleRemark?: string;
}
