import { CanActivate, ExecutionContext, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express';
import { ValidateResponse } from "./auth.pb";
import { AuthService } from "./auth.service";

export interface IGetUserAuthInfoRequest extends Request {
  user: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(AuthService)
  public readonly service: AuthService;
  
  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: IGetUserAuthInfoRequest = ctx.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];
    const { status, userId }: ValidateResponse = await this.service.validate(token);

    req.user = userId;

    if (status !== HttpStatus.OK) {
      throw new UnauthorizedException();
    }

    return true;
  }
}