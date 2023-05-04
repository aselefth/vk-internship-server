import { Controller, Post, Get, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
	signUp(@Body() signUpDto: RegisterDto) {
		return this.authService.signUp(signUpDto)
	}

	@Post('signin')
	signIn(@Body() signInDto: LoginDto, @Res() res: any) {
		return this.authService.signIn(signInDto, res)
	}

	@Get('signout')
	signOut(@Res() res: any) {
		return this.authService.signOut(res)
	}
}
