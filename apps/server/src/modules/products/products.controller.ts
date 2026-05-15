import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@ApiTags('商品管理')
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  @ApiOperation({ summary: '获取商品列表（分页、筛选）' })
  findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('carModel') carModel?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.productsService.findAll({
      page: Number(page),
      pageSize: Number(pageSize),
      category,
      brand,
      carModel,
      keyword,
    });
  }

  @Get('products/:id')
  @ApiOperation({ summary: '获取商品详情' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post('admin/products')
  @ApiBearerAuth()
  @ApiOperation({ summary: '新增商品（后台）' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put('admin/products/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新商品（后台）' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete('admin/products/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除商品（软删除）' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
