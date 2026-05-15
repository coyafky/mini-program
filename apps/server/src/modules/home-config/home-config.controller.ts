import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HomePageConfigService } from './home-config.service';

@ApiTags('首页配置')
@Controller()
export class HomeConfigController {
  constructor(private readonly homeConfigService: HomePageConfigService) {}

  @Get('home/config')
  @ApiOperation({ summary: '获取首页配置（用户端）' })
  getConfig() {
    return this.homeConfigService.getConfig();
  }

  @Put('admin/home/config/:key')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新首页配置项（后台）' })
  updateConfig(@Param('key') key: string, @Body('value') value: any) {
    return this.homeConfigService.updateConfig(key, value);
  }

  @Put('admin/home/config')
  @ApiBearerAuth()
  @ApiOperation({ summary: '批量更新首页配置（后台）' })
  async batchUpdate(@Body() body: Record<string, any>) {
    const results = [];
    for (const [key, value] of Object.entries(body)) {
      results.push(await this.homeConfigService.updateConfig(key, value));
    }
    return results;
  }
}
