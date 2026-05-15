import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { StoresModule } from './modules/stores/stores.module';
import { ProductsModule } from './modules/products/products.module';
import { PackagesModule } from './modules/packages/packages.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { HomeConfigModule } from './modules/home-config/home-config.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CarModelsModule } from './modules/car-models/car-models.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    PrismaModule,
    StoresModule,
    ProductsModule,
    PackagesModule,
    ReservationsModule,
    HomeConfigModule,
    UsersModule,
    AuthModule,
    CarModelsModule,
    StatsModule,
  ],
})
export class AppModule {}
