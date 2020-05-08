import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentials: AuthCredentialDto): Promise<void>{
    return this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentials: AuthCredentialDto): Promise<void>{
    return this.authService.signIn(authCredentials);
  }

}
