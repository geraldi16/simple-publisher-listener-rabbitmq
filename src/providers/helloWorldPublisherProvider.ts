import { Provider } from '@nestjs/common';

import { RabbitMQPublisherProvider } from 'src/common/publisher/RabbitMQPublisherProvider';

export const helloWorldPublisherProvider: Provider = {
  provide: 'hello-world-provider',
  inject: [RabbitMQPublisherProvider],
  async useFactory(rabbitMqPublisherProvider: RabbitMQPublisherProvider) {
    return rabbitMqPublisherProvider.get('hello-world');
  },
};
