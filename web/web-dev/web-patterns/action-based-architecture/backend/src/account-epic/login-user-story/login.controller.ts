import { Body, Controller, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserStory } from './login.user-story';
import { LoginResponse } from './login.response.dto';
import { LoginRequest } from './login.request.dto';



@ApiTags("Accounts")
@ApiBearerAuth()
@Controller('/api/v1/accounts')
export class LoginController {

  constructor(

    private readonly loginUseStory: LoginUserStory,
  ) { }


  @ApiOperation({ summary: 'Login a user' })
  @Post('/login')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 200, description: 'User logged.', type: LoginResponse })
  @ApiResponse({ status: 404, description: 'The user is not exist.' })
  @ApiExtraModels(LoginResponse)
  async logiIn(@Body() logInRequest: LoginRequest): Promise<LoginResponse> {
      return await this.loginUseStory.execute(logInRequest);
  }
}




