import { Injectable } from '@nestjs/common';
import { Config } from '../common/Config';
import { MessageHandler } from '../common/MessageHandler';

@Injectable()
export class HelloWorldListenerHandler extends MessageHandler {
  constructor(config: Config) {
    super();

    const { protocol, hostname, port, username, password, queue_config } = config.get('rabbitmq');
    const retryExchangeConfig = queue_config['retry-events'];
    const helloWorldQueueConfig = queue_config['hello-world'];
    const retryConfig = {
      connectionURI: `${protocol}://${username}:${password}@${hostname}:${port}/${encodeURIComponent(
        retryExchangeConfig.vhost,
      )}`,
      exchangeName: retryExchangeConfig.exchange,
      exchangeType: retryExchangeConfig.exchangeType,
      queueName: helloWorldQueueConfig.queue,
      routingKey: helloWorldQueueConfig.routingKey,
    };
    this.retryExchangePublisher = this._getRetryPublisher(retryConfig);
  }

  async handleMessage(messageString: string) {
    // throw new Error('error hello world');
    console.log(JSON.parse(messageString).message);
  }
}
