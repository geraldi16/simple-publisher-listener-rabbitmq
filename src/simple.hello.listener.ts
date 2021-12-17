import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { SimpleHelloListenerModule } from './simple.hello.listener.module';

async function bootstrap() {
  const app = await NestFactory.create(SimpleHelloListenerModule);
  const rmqOptions = app.get('simple-hello-world-options');
  app.connectMicroservice<MicroserviceOptions>(rmqOptions);
  await app.startAllMicroservices();
  await app.listen(1618);
  console.log(`Server is running at http://localhost:1618`);
}
bootstrap();
