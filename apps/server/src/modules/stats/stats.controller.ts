import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('数据统计')
@Controller('admin/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  @ApiBearerAuth()
  @ApiOperation({ summary: '总览指标' })
  getOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.statsService.getOverview(startDate, endDate);
  }

  @Get('trend')
  @ApiBearerAuth()
  @ApiOperation({ summary: '预约趋势' })
  getTrend(@Query('days') days = '7') {
    return this.statsService.getReservationTrend(Number(days));
  }

  @Get('stores')
  @ApiBearerAuth()
  @ApiOperation({ summary: '门店预约分布' })
  getStoreDistribution() {
    return this.statsService.getStoreDistribution();
  }

  @Get('funnel')
  @ApiBearerAuth()
  @ApiOperation({ summary: '预约转化漏斗' })
  getFunnel() {
    return this.statsService.getFunnel();
  }

  @Get('top-products')
  @ApiBearerAuth()
  @ApiOperation({ summary: '热门商品排行' })
  getTopProducts(@Query('limit') limit = '10') {
    return this.statsService.getTopProducts(Number(limit));
  }
}
