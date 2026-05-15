import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HomeConfigService } from './home-config.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { CreateFloorDto, UpdateFloorDto } from './dto/floor.dto';
import { CreateFloorTabDto, UpdateFloorTabDto } from './dto/floor-tab.dto';
import { CreateFloorTabItemDto, UpdateFloorTabItemDto, BatchReplaceFloorTabItemsDto } from './dto/floor-tab-item.dto';

@ApiTags('首页配置')
@Controller()
export class HomeConfigController {
  constructor(private readonly homeConfigService: HomeConfigService) {}

  // ==================== 小程序端 ====================

  @Get('mini/home-config')
  @ApiOperation({ summary: '获取首页配置（小程序端）' })
  getMiniHomeConfig() {
    return this.homeConfigService.getMiniHomeConfig();
  }

  // ==================== Banner ====================

  @Get('admin/banners')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Banner列表（后台）' })
  findBanners(@Query('position') position?: string) {
    return this.homeConfigService.findBanners(position);
  }

  @Post('admin/banners')
  @ApiBearerAuth()
  @ApiOperation({ summary: '新增Banner（后台）' })
  createBanner(@Body() dto: CreateBannerDto) {
    return this.homeConfigService.createBanner(dto);
  }

  @Put('admin/banners/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新Banner（后台）' })
  updateBanner(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.homeConfigService.updateBanner(id, dto);
  }

  @Delete('admin/banners/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除Banner（后台）' })
  removeBanner(@Param('id') id: string) {
    return this.homeConfigService.removeBanner(id);
  }

  // ==================== Floor ====================

  @Get('admin/floors')
  @ApiBearerAuth()
  @ApiOperation({ summary: '楼层列表（后台）' })
  findFloors() {
    return this.homeConfigService.findFloors();
  }

  @Post('admin/floors')
  @ApiBearerAuth()
  @ApiOperation({ summary: '新增楼层（后台）' })
  createFloor(@Body() dto: CreateFloorDto) {
    return this.homeConfigService.createFloor(dto);
  }

  @Put('admin/floors/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新楼层（后台）' })
  updateFloor(@Param('id') id: string, @Body() dto: UpdateFloorDto) {
    return this.homeConfigService.updateFloor(id, dto);
  }

  @Delete('admin/floors/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除楼层（后台）' })
  removeFloor(@Param('id') id: string) {
    return this.homeConfigService.removeFloor(id);
  }

  // ==================== FloorTab ====================

  @Post('admin/floor-tabs')
  @ApiBearerAuth()
  @ApiOperation({ summary: '新增选块（后台）' })
  createFloorTab(@Body() dto: CreateFloorTabDto) {
    return this.homeConfigService.createFloorTab(dto);
  }

  @Put('admin/floor-tabs/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新选块（后台）' })
  updateFloorTab(@Param('id') id: string, @Body() dto: UpdateFloorTabDto) {
    return this.homeConfigService.updateFloorTab(id, dto);
  }

  @Delete('admin/floor-tabs/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除选块（后台）' })
  removeFloorTab(@Param('id') id: string) {
    return this.homeConfigService.removeFloorTab(id);
  }

  // ==================== FloorTabItem ====================

  @Post('admin/floor-tab-items')
  @ApiBearerAuth()
  @ApiOperation({ summary: '新增推荐项（后台）' })
  createFloorTabItem(@Body() dto: CreateFloorTabItemDto) {
    return this.homeConfigService.createFloorTabItem(dto);
  }

  @Put('admin/floor-tab-items/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新推荐项（后台）' })
  updateFloorTabItem(@Param('id') id: string, @Body() dto: UpdateFloorTabItemDto) {
    return this.homeConfigService.updateFloorTabItem(id, dto);
  }

  @Delete('admin/floor-tab-items/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除推荐项（后台）' })
  removeFloorTabItem(@Param('id') id: string) {
    return this.homeConfigService.removeFloorTabItem(id);
  }

  @Post('admin/floor-tab-items/batch')
  @ApiBearerAuth()
  @ApiOperation({ summary: '批量替换选块的推荐项（后台）' })
  batchReplaceFloorTabItems(@Body() dto: BatchReplaceFloorTabItemsDto) {
    return this.homeConfigService.batchReplaceFloorTabItems(dto);
  }
}
