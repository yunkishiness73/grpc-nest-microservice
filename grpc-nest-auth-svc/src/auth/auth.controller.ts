import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginRequestDto, RegisterRequestDto, ValidateRequestDto } from './auth.dto';
import { AUTH_SERVICE_NAME, LoginResponse, RegisterResponse, ValidateResponse } from './auth.pb';
import { AuthService } from './service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'Register')
  public register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    return this.authService.register(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Login')
  public login(payload: LoginRequestDto): Promise<LoginResponse> {
    return this.authService.login(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  public validate(payload: ValidateRequestDto): Promise<ValidateResponse> {
    return this.authService.validate(payload);
  }
}