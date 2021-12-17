import { Provider } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { Config } from '../common/Config';

export const simpleHelloWorldRMQOptionsProvider: Provider = {
  provide: 'simple-hello-world-options',
  inject: [Config],
  async useFactory(config: Config) {
    const { protocol, hostname, port, username, password, queue_config } = config.get('rabbitmq');
    const { vhost, queue } = queue_config['hello-world'];
    const hostURI = `${protocol}://${username}:${password}@${hostname}:${port}/${encodeURIComponent(
      vhost,
    )}`;
    return {
      transport: Transport.RMQ,
      options: {
        urls: [hostURI],
        queue: queue,
        queueOptions: { durable: true },
      },
    };
  },
};

export const simpleHelloWorldPublisherProvider: Provider = {
  provide: 'simple-hello-world-publisher-provider',
  inject: ['simple-hello-world-options'],
  async useFactory(options: any) {
    return ClientProxyFactory.create(options);
  },
};
