import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    private EXPIRATION_TIME = "7 days";
    private AUDIENCE = "users";

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService 
    ) {}

    async signUp(SignUpDto: SignUpDto) {
        return await this.userService.create(SignUpDto);
    }

    async signIn(SignInDto: SignInDto) {
        const { email, password } = SignInDto;
        
        const user = await this.userService.getUserByEmail(email);
        if (!user) throw new UnauthorizedException("Email or password not valid.");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException("Email or password not valid.");

        return this.createToken(user)
    }

    createToken(user: User) {
        const { id, email } = user;
        const token = this.jwtService.sign({email}, {
            expiresIn: this.EXPIRATION_TIME,
            subject: String(id),
            audience: this.AUDIENCE,
        })
        return { token };
    }
}
