import { Body, Controller, Post } from '@nestjs/common';
import { SignInRequest } from './signin-request.dto';

@Controller('auth')
export class AuthController {

  @Post('sign-in')
  async signIn(@Body() body: SignInRequest) {
    // If validation fails, NestJS automatically returns 400
    return {
      message: 'Sign in data is valid',
      data: body,
    };
  }
}
