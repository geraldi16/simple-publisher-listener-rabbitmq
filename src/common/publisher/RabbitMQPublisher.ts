import amqpConnectionManager, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { RabbitMQConnection } from '../base/RabbitMQConnection';

export class RabbitMQPublisher extends RabbitMQConnection {
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
  ) {
    super(
      connectionURI,
      exchangeName,
      exchangeType,
      queueName,
      routingKey,
      queueMaxPriority,
      connectionName,
      addDeadLetter,
    );
  }

  async publish(message: string) {
    if (!this.connection) this._init();

    try {
      await this.channel.publish(this.exchangeName, '#', Buffer.from(message));
      console.log(`Message: ${message} Sent to Exchange: ${this.exchangeName} with routing key: #`);
    } catch (error) {
      console.log(`error: ${error.message}`);
    }
  }

  protected async _setupChannel(channel: ConfirmChannel) {
    await channel.assertExchange(this.exchangeName, this.exchangeType);
    await channel.assertQueue(this.queueName, {
      durable: true,
    });
    console.log(
      `Binding Queue ${this.queueName} to Exchange: ${this.exchangeName} with Routing Key: #`,
    );
    return channel.bindQueue(this.queueName, this.exchangeName, '#');
  }
}
