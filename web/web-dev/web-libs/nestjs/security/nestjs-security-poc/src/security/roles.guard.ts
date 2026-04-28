import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../security/roles.decorator';
import { Role } from '../security/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If specific roles are required (e.g., ADMIN), check them
    if (requiredRoles) {
      const hasRole = requiredRoles.some((role) => user.role === role);
      
      // If user has required role, they can access
      if (hasRole) {
        return true;
      }
      
      // If user doesn't have required role but endpoint allows USER role,
      // check if they're accessing their own resource
      if (requiredRoles.includes(Role.USER)) {
        const isOwner = Number(request.params.id) === user.userId;
        return isOwner;
      }
      
      return false;
    }

    // If NO roles are required → enforce ownership only
    const isOwner = Number(request.params.id) === user.userId;
    return isOwner;
  }
}