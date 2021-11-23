import amqpConnectionManager, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';

import { MessageHandler } from '../MessageHandler';

export class RabbitMQListener {
  protected connection: AmqpConnectionManager;
  protected channel: ChannelWrapper;
  protected channelSetup: boolean = false;
  protected rabbitMQChannel: ConfirmChannel;
  protected initialized: boolean = false;

  constructor(
    protected readonly connectionURI: string,
    protected readonly exchangeName: string,
    protected readonly exchangeType: string,
    protected readonly queueName: string,
    protected readonly routingKey: string | string[],
    protected readonly queueMaxPriority: number,
    protected readonly connectionName: string,
    protected readonly addDeadLetter: boolean = true,
    protected readonly prefetch: number,
    protected readonly messageHandler: MessageHandler,
  ) {
    this._init();
  }

  async onMessage(message: ConsumeMessage) {
    const messageString: string = message.content.toString();

    try {
      await this.messageHandler.handleMessage(messageString);
      this.channel.ack(message);
    } catch (error) {
      await this.messageHandler.handleError(error, message);
    }
  }

  private _init() {
    try {
      this.connection = amqpConnectionManager.connect([this.connectionURI]);
      this.channel = this.connection.createChannel({
        setup: this._setupChannel.bind(this),
      });
    } catch (error) {
      console.log(`error _init: ${error.message}`)
    }
  }

  private async _setupChannel(channel: ConfirmChannel) {
    await channel.assertExchange(this.exchangeName, this.exchangeType);
    await channel.assertQueue(this.queueName, {
      durable: true,
    });
    await channel.prefetch(this.prefetch || 1);
    await channel.consume(this.queueName, this.onMessage.bind(this));
    console.log(
      `Binding Queue ${this.queueName} to Exchange: ${this.exchangeName} with Routing Key: #`,
    );
    return channel.bindQueue(this.queueName, this.exchangeName, '#');
  }
}