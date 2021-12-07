import { Injectable } from '@nestjs/common';

import { Config } from '../Config';
import { RabbitMQPublisher } from './RabbitMQPublisher';

@Injectable()
export class RabbitMQPublisherProvider {
  constructor(private readonly config: Config) {}
  public get(configName: string): RabbitMQPublisher {
    const { protocol, hostname, port, username, password, queue_config } =
      this.config.get('rabbitmq');
    console.log('hostname', hostname);
    const { vhost, exchange, exchangeType, queue, routingKey, maxPriority, addDeadLetter } =
      queue_config[configName];
    const hostURI = `${protocol}://${username}:${password}@${hostname}:${port}/${encodeURIComponent(
      vhost,
    )}`;
    const publisher = new RabbitMQPublisher(
      hostURI,
      exchange,
      exchangeType,
      queue,
      routingKey,
      maxPriority,
      `Publisher :${configName}`,
      addDeadLetter,
    );
    return publisher;
  }
}
