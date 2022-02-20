import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as fs from 'fs';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const LogStream = fs.createWriteStream('api.log', {
  flags: 'a', // append
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' }});
  // const config = new DocumentBuilder()
  //   .setTitle('backend')
  //   .setDescription('the transcandence API')
  //   .setVersion('1.0')
  //   .build()
  //   const document = SwaggerModule.createDocument(app, config);
  //   SwaggerModule.setup('api', app, document);
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe())
  app.use(morgan('combined', { stream: LogStream }));
  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
