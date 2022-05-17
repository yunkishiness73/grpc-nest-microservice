import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { Auth } from './auth.entity';
import { AuthService } from './service/auth.service';
import { JwtHelper } from './service/jwt.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
      secret: 'verysecretkey',
      signOptions: {
        expiresIn: 3600, //1h
      },
    }),
    TypeOrmModule.forFeature([Auth]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtHelper, JwtStrategy],
})
export class AuthModule {}