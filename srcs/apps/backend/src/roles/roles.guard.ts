import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from 'src/entities/user.entity';
import { getConnection } from 'typeorm';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest<Request>();
    const requiredRoles = this.reflector.getAllAndMerge<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles)
      return true;

    const user = await getConnection().manager.query(`
      select * from users
      where "users"."id" = $1
    `, [Object.values(req.user)[0]]);
    return requiredRoles.some((role) => user[0].type == role);
  }
}
