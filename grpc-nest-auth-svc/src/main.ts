import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { protobufPackage } from './auth/auth.pb';
import { HttpExceptionFilter } from './auth/filter/http-exception.filter';

async function bootstrap() {
  const app: INestMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50051',
        package: protobufPackage,
        protoPath: 'node_modules/grpc-nest-proto/proto/auth.proto',
      },
    });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.listen();
}
bootstrap();
