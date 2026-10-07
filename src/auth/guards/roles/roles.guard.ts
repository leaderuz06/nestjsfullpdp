import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean{
    const requiredRoles = this.reflector.getAllAndOverride<Role>(ROLES_KEY, 
      [context.getHandler(), context.getClass()]
    )

    if(!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if(!user) throw new UnauthorizedException('Access denied. User not found.');
    const hasRole = requiredRoles.includes(user.role)
    if(!hasRole) throw new UnauthorizedException('Access denied. User does not have the required role.');
    return true
  }
}
