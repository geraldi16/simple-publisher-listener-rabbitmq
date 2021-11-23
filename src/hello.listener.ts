import { NestFactory } from '@nestjs/core';

import { HelloListenerModule } from './hello.listener.module';

async function bootstrap() {
  const app = await NestFactory.create(HelloListenerModule);
  await app.listen(1617);
  console.log(`Server is running at http://localhost:1617`);
}
bootstrap();
