import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../auth.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtHelper {
  @InjectRepository(Auth)
  private readonly repository: Repository<Auth>;
  private readonly SECRET = 'verysecretkey';
  private readonly logger = new Logger(JwtHelper.name);

  constructor(private readonly jwt: JwtService) {}

  public async decode(token: string): Promise<any> {
    return this.jwt.decode(token, null);
  }

  public async validateUser(decoded: any): Promise<Auth> {
    console.log('======VALIDATE FAIL=======')
    console.log(JSON.stringify(decoded))
    const result = await this.repository.findOneBy({
      id: decoded.id,
    })
    console.log(JSON.stringify(result))
    return result;
  }

  public generateToken(auth: Auth): string {
    this.logger.log(JSON.stringify(auth));
    this.logger.log(this.jwt);
    return this.jwt.sign({
      id: auth.id,
      email: auth.email,
    });
  }

  public isPasswordValid(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  public hash(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  public verify(token: string): any {
    return this.jwt.verify(token, {
      secret: this.SECRET,
    });
  }
}
