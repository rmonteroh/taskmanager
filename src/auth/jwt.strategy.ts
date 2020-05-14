import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userTepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myT0pS3cr3t',
    });
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;
    const user = this.userTepository.findOne({username});

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}