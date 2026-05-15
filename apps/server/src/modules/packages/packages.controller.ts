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
import { PackagesService } from './packages.service';
import { CreatePackageDto, UpdatePackageDto } from './dto/create-package.dto';

@ApiTags('套餐管理')
@Controller()
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get('packages')
  @ApiOperation({ summary: '获取套餐列表' })
  findAll(@Query('page') page = '1', @Query('pageSize') pageSize = '10') {
    return this.packagesService.findAll(Number(page), Number(pageSize));
  }

  @Get('packages/:id')
  @ApiOperation({ summary: '获取套餐详情' })
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(id);
  }

  @Post('admin/packages')
  @ApiBearerAuth()
  @ApiOperation({ summary: '新增套餐（后台）' })
  create(@Body() dto: CreatePackageDto) {
    return this.packagesService.create(dto);
  }

  @Put('admin/packages/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新套餐（后台）' })
  update(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.packagesService.update(id, dto);
  }

  @Delete('admin/packages/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除套餐（软删除）' })
  remove(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }
}
