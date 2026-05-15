import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CarModelsService } from './car-models.service';

@ApiTags('车型管理')
@Controller()
export class CarModelsController {
  constructor(private readonly carModelsService: CarModelsService) {}

  @Get('car-models')
  @ApiOperation({ summary: '获取车型列表' })
  findAll(@Query('brand') brand?: string) {
    return this.carModelsService.findAll(brand);
  }

  @Get('car-models/brands')
  @ApiOperation({ summary: '获取所有品牌' })
  findBrands() {
    return this.carModelsService.findBrands();
  }

  @Get('car-models/:id')
  @ApiOperation({ summary: '获取车型详情' })
  findOne(@Param('id') id: string) {
    return this.carModelsService.findOne(id);
  }

  @Post('admin/car-models')
  @ApiBearerAuth()
  @ApiOperation({ summary: '新增车型' })
  create(@Body() data: { brand: string; model: string; year?: string }) {
    return this.carModelsService.create(data);
  }

  @Put('admin/car-models/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新车型' })
  update(
    @Param('id') id: string,
    @Body() data: { brand?: string; model?: string; year?: string },
  ) {
    return this.carModelsService.update(id, data);
  }

  @Delete('admin/car-models/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除车型' })
  remove(@Param('id') id: string) {
    return this.carModelsService.remove(id);
  }
}
