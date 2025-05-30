import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../entities/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles from the handler or controller using the ROLES_KEY
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, allow access
    if (!requiredRoles || !requiredRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Debug log to check what roles are required and what user has
    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);
    this.logger.debug(`User info: ${JSON.stringify(user)}`);
    console.log('User info:', user);
    if (!user || !user.role) {
      this.logger.warn('No user or role found in request');
      return false;
    }

    // Check if the user's role is in the required roles
    return requiredRoles.some((role) => role === user.role);
  }
}
