import { Provider } from '@nestjs/common';
import { RabbitMQListenerProvider } from '../common/listener/RabbitMQListenerProvider';

import { HelloWorldListenerHandler } from '../handlers/HelloWorldListenerHandler';

export const helloWorldListenerProvider: Provider = {
  provide: 'hello-world-listener-provider',
  inject: [RabbitMQListenerProvider, HelloWorldListenerHandler],
  async useFactory(
    rabbitMqListenerProvider: RabbitMQListenerProvider,
    helloWorldHandler: HelloWorldListenerHandler,
  ) {
    return rabbitMqListenerProvider.get('hello-world', helloWorldHandler);
  },
};
