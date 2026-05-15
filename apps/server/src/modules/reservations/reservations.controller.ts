import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/create-reservation.dto';

@ApiTags('预约单管理')
@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // ====== 用户端接口 ======
  @Post('reservations')
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户提交预约单' })
  create(@Body() dto: CreateReservationDto, @Req() req: any) {
    const userId = req.user?.userId || 'anonymous';
    return this.reservationsService.create(userId, dto);
  }

  @Get('reservations')
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户查看自己的预约单列表' })
  findMyReservations(
    @Req() req: any,
    @Query('status') status?: string,
  ) {
    const userId = req.user?.userId || 'anonymous';
    return this.reservationsService.findMyReservations(userId, status);
  }

  @Get('reservations/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户查看预约单详情' })
  findMyReservation(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId || 'anonymous';
    return this.reservationsService.findMyReservation(userId, id);
  }

  // ====== 后台管理接口 ======
  @Get('admin/reservations')
  @ApiBearerAuth()
  @ApiOperation({ summary: '后台获取预约单列表' })
  findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('status') status?: string,
    @Query('storeId') storeId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reservationsService.findAll({
      page: Number(page),
      pageSize: Number(pageSize),
      status,
      storeId,
      startDate,
      endDate,
    });
  }

  @Get('admin/reservations/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '后台获取预约单详情' })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch('admin/reservations/:id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: '后台更新预约单状态' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReservationStatusDto,
    @Req() req: any,
  ) {
    const operatorId = req.user?.userId || 'admin';
    return this.reservationsService.updateStatus(id, dto, operatorId);
  }
}
