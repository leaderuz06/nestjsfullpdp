import { Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExpressAdapter } from "@nestjs/platform-express";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt-config";
import type { ConfigType } from "@nestjs/config";
import { AuthPayload } from "../types/auth-type";
import { AuthService } from "../auth.service";



export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@Inject(jwtConfig.KEY) private jwtConfiguration: ConfigType<typeof jwtConfig>, private authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfiguration.secret as any
        })
    }
    validate(payload: AuthPayload) {
        const userId = payload.sub;
        return this.authService.validateJwtUser(userId);
    }
}