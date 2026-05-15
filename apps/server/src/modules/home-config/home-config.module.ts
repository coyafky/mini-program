import { Module } from '@nestjs/common';
import { HomePageConfigService } from './home-config.service';
import { HomeConfigController } from './home-config.controller';

@Module({
  controllers: [HomeConfigController],
  providers: [HomePageConfigService],
  exports: [HomePageConfigService],
})
export class HomeConfigModule {}
