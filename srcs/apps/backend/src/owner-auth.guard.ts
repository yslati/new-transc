import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { getConnection } from 'typeorm';

@Injectable()
export class OwnerAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await context.switchToHttp().getRequest<Request>();
    const user: Object = req.user;
    const channel = await getConnection().manager.query(`
      select DISTINCT "users_channels"."userId", "users_channels"."type" from channels
      inner join users_channels on "channels"."id" = "users_channels"."channelId"
      where "channels"."id" = $1
      and ( "users_channels"."userId" = $2 and "users_channels"."type" = 'owner' )
      or ( "users_channels"."userId" = $2 and "users_channels"."type" = 'admin' )
    `, [req.params.channelId, Object.values(user)[0]]);
    if (channel.length == 0)
      return false;
    return true;
  }
}
