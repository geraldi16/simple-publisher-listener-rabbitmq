import { Module } from '@nestjs/common';

import { CommonModule } from './common';
import { SimpleHelloWorldListenerHandler } from './handlers/SimpleHelloWorldListenerHandler';
import { simpleHelloWorldRMQOptionsProvider } from './providers/simpleHelloWOrldPublisherProvider';

@Module({
  imports: [CommonModule],
  providers: [SimpleHelloWorldListenerHandler, simpleHelloWorldRMQOptionsProvider],
})
export class SimpleHelloListenerModule {}
