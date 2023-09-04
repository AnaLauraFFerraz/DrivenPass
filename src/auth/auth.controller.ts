import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("sign-up")
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() signUpDto: SignUpDto) {
        try {
            return await this.authService.signUp(signUpDto);
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    @Post("sign-in")
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() signInDto: SignInDto) {
        try {
            return await this.authService.signIn(signInDto);
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }
}
