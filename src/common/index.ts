import { Module } from '@nestjs/common';

import { Config } from './Config';
import { RabbitMQPublisherProvider } from './publisher/RabbitMQPublisherProvider';

@Module({
  imports: [],
  providers: [Config, RabbitMQPublisherProvider],
  exports: [Config, RabbitMQPublisherProvider],
})
export class CommonModule {}
