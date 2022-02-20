import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { getConnection } from 'typeorm';

@Injectable()
export class AppService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    await getConnection().manager.query(`
      update users set "status" = 'offline'
    `);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
