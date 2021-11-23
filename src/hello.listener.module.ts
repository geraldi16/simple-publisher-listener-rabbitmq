import { Module } from '@nestjs/common';

import { CommonModule } from './common';
import { HelloWorldListenerHandler } from './handlers/HelloWorldListenerHandler';
import { helloWorldListenerProvider } from './providers/helloWorldListenerProvider';

@Module({
  imports: [CommonModule],
  providers: [helloWorldListenerProvider, HelloWorldListenerHandler],
})
export class HelloListenerModule {}
