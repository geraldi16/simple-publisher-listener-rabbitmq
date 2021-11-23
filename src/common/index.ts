import { Module } from '@nestjs/common';

import { Config } from './Config';
import { RabbitMQListenerProvider } from './listener/RabbitMQListenerProvider';
import { RabbitMQPublisherProvider } from './publisher/RabbitMQPublisherProvider';

@Module({
  imports: [],
  providers: [Config, RabbitMQPublisherProvider, RabbitMQListenerProvider],
  exports: [Config, RabbitMQPublisherProvider, RabbitMQListenerProvider],
})
export class CommonModule {}
