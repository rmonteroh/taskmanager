import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UserRepository extends Repository<User>{
  
  async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
    const {username, password} = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    
    const user = new User();
    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') { // duplicate username
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(authCredentialDto:AuthCredentialDto): Promise<string> {
    const { username, password } = authCredentialDto;
    const user = await this.findOne({username});
    if (user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }
}