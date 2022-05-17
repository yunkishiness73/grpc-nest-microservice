import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductModule } from './product/product.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
