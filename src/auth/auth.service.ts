import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ){}

  async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialDto: AuthCredentialDto) {
    const username = await this.userRepository.validateUserPassword(authCredentialDto);
    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
  }
}
