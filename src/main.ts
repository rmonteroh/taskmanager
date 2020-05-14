import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  // Habilitando cors
  if (process.env.NODE_ENV === 'development') {
    logger.log('App runing on development mode :)')
    app.enableCors();
  }

  const serverConfig = config.get('server');  
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  
  logger.log(`Aplication run on port ${port}`);
}
bootstrap();
