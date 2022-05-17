import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtHelper } from "../service/jwt.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(JwtHelper)
  private readonly jwtService: JwtHelper;

  constructor() {
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'verysecretkey',
    });
  }

  async validate(token: string) {
   return this.jwtService.validateUser(token);
  }
}