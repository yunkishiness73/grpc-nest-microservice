import { Body, Controller, Inject, Post, Put } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthServiceClient, AUTH_SERVICE_NAME, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './auth.pb';

@Controller('auth')
export class AuthController {
  private svc: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('register')
  public async register(@Body() body: RegisterRequest): Promise<Observable<RegisterResponse>> {
    return this.svc.register(body);
  }

  @Post('login')
  public async login(@Body() body: LoginRequest): Promise<Observable<LoginResponse>> {
    return this.svc.login(body);
  }
}
