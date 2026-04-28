import { Body, Controller, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SigninUserStory } from './signin.user-story';
import { SigninResponse } from './signin-response.dto';
import { SigninRequest } from './signin-request.dto';



@ApiTags("Accounts")
@ApiBearerAuth()
@Controller('/api/v1/accounts')
export class SigninController {

  constructor(
    private readonly signinUserStory: SigninUserStory
  ) { }

  @ApiOperation({ summary: 'Signin a user' })
  @Post('/signin')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'User created.', type: SigninResponse })
  @ApiResponse({ status: 409, description: 'The user already exists.' })
  @ApiExtraModels(SigninResponse)
  async signIn(@Body() signInRequest: SigninRequest): Promise<SigninResponse> {
      return await this.signinUserStory.execute(signInRequest);
  }

}