import { Inject, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { ConfigType } from "@nestjs/config";
import { AuthPayload } from "../types/auth-type";
import refreshConfig from "../config/refresh-config";
import { AuthService } from "../auth.service";
import { Request } from "express";



export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
    constructor(@Inject(refreshConfig.KEY) private refreshJwtConfiguration: ConfigType<typeof refreshConfig>,
    private authService: AuthService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: refreshJwtConfiguration.secret as any,
            passReqToCallback: true
        })
    }
    validate(req: Request,payload: AuthPayload) {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthorizedException('Invalid credentials');
        const refreshToken = authHeader.split(' ')[1];
        if(!refreshToken) throw new UnauthorizedException('Access denied');
        return this.authService.validateRefreshToken(payload.sub, refreshToken);
    }
}