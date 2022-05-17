import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ValidateRequestDto,
} from '../auth.dto';
import { Auth } from '../auth.entity';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../auth.pb';
import { JwtHelper } from '../service/jwt.service';

@Injectable()
export class AuthService {
  @InjectRepository(Auth)
  private readonly repository: Repository<Auth>;

  @Inject(JwtHelper)
  private readonly jwtService: JwtHelper;

  public async register({
    email,
    password,
  }: RegisterRequestDto): Promise<RegisterResponse> {
    let auth: Auth = await this.repository.findOne({ where: { email } });

    if (auth) {
      return {
        status: HttpStatus.CONFLICT,
        error: ['Email already exists'],
      };
    }

    auth = new Auth();
    auth.email = email;
    auth.password = this.jwtService.hash(password);

    await auth.save();

    return {
      status: HttpStatus.CREATED,
      error: null,
    };
  }

  public async login({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponse> {
    const auth: Auth = await this.repository.findOne({ where: { email } });
    if (!auth) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Email not found'],
        token: null,
      };
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(
      password,
      auth.password,
    );
    if (!isPasswordValid) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid credentials'],
        token: null,
      };
    }

    const token: string = this.jwtService.generateToken(auth);

    return {
      status: HttpStatus.OK,
      error: null,
      token,
    };
  }

  public async validate({
    token,
  }: ValidateRequestDto): Promise<ValidateResponse> {
    try {
      const decoded: Auth = await this.jwtService.verify(token);
      const auth: Auth = await this.jwtService.validateUser(decoded);
      
      console.log(`
        Decoded: ${JSON.stringify(decoded)}
        Auth: ${JSON.stringify(auth)}
      `)

      if (!auth) {
        return {
          status: HttpStatus.UNAUTHORIZED,
          error: ['User not found'],
          userId: null,
        };
      }

      return { status: HttpStatus.OK, error: null, userId: decoded.id };
    } catch (err) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid token'],
        userId: null,
      };
    }
  }
}
