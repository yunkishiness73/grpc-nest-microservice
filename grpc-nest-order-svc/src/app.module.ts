import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { OrderModule } from './order/order.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
