import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common';
import { helloWorldPublisherProvider } from './providers/helloWorldPublisherProvider';
import {
  simpleHelloWorldPublisherProvider,
  simpleHelloWorldRMQOptionsProvider,
} from './providers/simpleHelloWOrldPublisherProvider';

@Module({
  imports: [CommonModule],
  controllers: [AppController],
  providers: [
    AppService,
    helloWorldPublisherProvider,
    simpleHelloWorldPublisherProvider,
    simpleHelloWorldRMQOptionsProvider,
  ],
})
export class AppModule {}
