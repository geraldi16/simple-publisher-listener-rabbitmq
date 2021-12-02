import { Injectable } from '@nestjs/common';

import { Config } from '../Config';
import { MessageHandler } from '../MessageHandler';
import { RabbitMQListener } from './RabbitMQListener';

@Injectable()
export class RabbitMQListenerProvider {
  constructor(private readonly config: Config) {}
  public get(configName: string, messageHandler: MessageHandler): RabbitMQListener {
    const { protocol, hostname, port, username, password, queue_config } =
      this.config.get('rabbitmq');
    const {
      vhost,
      exchange,
      exchangeType,
      queue,
      routingKey,
      maxPriority,
      addDeadLetter,
      prefetch,
    } = queue_config[configName];
    const hostURI = `${protocol}://${username}:${password}@${hostname}:${port}/${encodeURIComponent(
      vhost,
    )}`;
    const listener = new RabbitMQListener(
      hostURI,
      exchange,
      exchangeType,
      queue,
      routingKey,
      maxPriority,
      `Publisher :${configName}`,
      addDeadLetter,
      prefetch,
      messageHandler,
    );
    return listener;
  }
}
