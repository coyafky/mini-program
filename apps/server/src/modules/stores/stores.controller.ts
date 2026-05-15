import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { CreateStoreDto, UpdateStoreDto, StoreProductConfigDto } from './dto/create-store.dto';

@ApiTags('门店管理')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @ApiOperation({ summary: '获取门店列表（分页）' })
  findAll(@Query('page') page = '1', @Query('pageSize') pageSize = '10') {
    return this.storesService.findAll(Number(page), Number(pageSize));
  }

  @Get('active')
  @ApiOperation({ summary: '获取所有激活门店' })
  findActive() {
    return this.storesService.findActiveStores();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取门店详情' })
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '新增门店' })
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新门店' })
  update(@Param('id') id: string, @Body() dto: UpdateStoreDto) {
    return this.storesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除门店（软删除）' })
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }

  @Get(':id/products')
  @ApiOperation({ summary: '获取门店商品和套餐' })
  getStoreProducts(
    @Param('id') id: string,
    @Query('category') category?: string,
  ) {
    return this.storesService.getStoreProducts(id, category);
  }

  @Put(':id/products')
  @ApiBearerAuth()
  @ApiOperation({ summary: '配置门店商品/套餐' })
  configureProducts(
    @Param('id') id: string,
    @Body() dto: StoreProductConfigDto,
  ) {
    return this.storesService.configureProducts(id, dto);
  }
}
