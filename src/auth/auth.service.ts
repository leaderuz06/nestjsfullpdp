import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './types/auth-type';
import refreshConfig from './config/refresh-config';
import type { ConfigType } from '@nestjs/config';
import { CurrentUser } from './types/currentUser';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService,
        @Inject(refreshConfig.KEY) private refreshConfiguration: ConfigType<typeof refreshConfig>
    ){}

    async register(createUserDto: CreateUserDto){
        const hashedPassword = await argon2.hash(createUserDto.password);
        const user = await this.userService.create({...createUserDto, password: hashedPassword});
        return user;
    }

    async validateUser(email: string, password: string){
        const user = await this.userService.findByEmail(email);
        if(!user) throw new NotFoundException('User not found');
        const isPasswordMatch = await argon2.verify(user.password, password);
        if(!isPasswordMatch) throw new ConflictException('Invalid credentials');
        return user;
    }   

    async login(userId: number){
        const { accessToken, refreshToken } = await this.generateTokens(userId);
        const hashedRefreshToken = await argon2.hash(refreshToken);
        await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
        return { id: userId, accessToken, refreshToken };
    }

    async refreshToken(userId: number){
        const { accessToken, refreshToken } = await this.generateTokens(userId);
        const hashedRefreshToken = await argon2.hash(refreshToken);
        await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
        return { id: userId, accessToken, refreshToken };
    }

    async generateTokens(userId: number){
        const payload:AuthPayload = { sub: userId };
        const [ accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshConfiguration)
        ])
        return { id: userId, accessToken, refreshToken };
    }

    async validateRefreshToken(userId: number, hashedRefreshToken: string){
        const user = await this.userService.findOne(userId);
        if(!user || !user.hashedRefreshToken) throw new UnauthorizedException('Invalid credentials');
        const refreshTokenMatch = await argon2.verify(user.hashedRefreshToken, hashedRefreshToken);
        if(!refreshTokenMatch) throw new UnauthorizedException('Invalid credentials');
        return user;
    }

    async signOut(userId: number){
        await this.userService.updateHashedRefreshToken(userId, null);
        return { message: 'Signed out successfully' };
    }

    async validateJwtUser(userId: number){
        const user = await this.userService.findOne(userId);
        if(!user) throw new UnauthorizedException('Invalid credentials');
        const currentUser: CurrentUser = { id: user.id, role: user.role };
        return currentUser;
    }

}
