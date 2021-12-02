import amqpConnectionManager, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';

import { MessageHandler } from '../MessageHandler';

export abstract class RabbitMQConnection {
  protected connection: AmqpConnectionManager;
  protected channel: ChannelWrapper;
  protected channelSetup = false;
  protected rabbitMQChannel: ConfirmChannel;
  protected initialized = false;

  constructor(
    protected readonly connectionURI: string,
    protected readonly exchangeName: string,
    protected readonly exchangeType: string,
    protected readonly queueName: string,
    protected readonly routingKey: string | string[],
    protected readonly queueMaxPriority: number,
    protected readonly connectionName: string,
    protected readonly addDeadLetter: boolean = true,
  ) {}

  protected _init() {
    try {
      this.connection = amqpConnectionManager.connect([this.connectionURI]);
      this.channel = this.connection.createChannel({
        setup: this._setupChannel.bind(this),
      });
    } catch (error) {
      console.log(`error _init: ${error.message}`);
    }
  }

  protected abstract _setupChannel(channel: ConfirmChannel);
}
