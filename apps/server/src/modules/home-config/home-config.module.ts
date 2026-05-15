import { Module } from '@nestjs/common';
import { HomeConfigService } from './home-config.service';
import { HomeConfigController } from './home-config.controller';

@Module({
  controllers: [HomeConfigController],
  providers: [HomeConfigService],
  exports: [HomeConfigService],
})
export class HomeConfigModule {}
