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
  private dlxExchangeName: string;
  private dlxExchangeType: string;

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

  async republish(message: string) {
    if (!this.connection) this._republishInit();

    try {
      await this.channel.publish(this.exchangeName, '#.retry', Buffer.from(message));
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

  private async _republishInit() {
    try {
      this.connection = amqpConnectionManager.connect([this.connectionURI]);
      this.channel = this.connection.createChannel({
        setup: this._setupRetryChannel.bind(this),
      });
    } catch (error) {
      console.log(`error _repulishInit: ${error.message}`);
    }
  }

  private async _setupRetryChannel(channel: ConfirmChannel) {
    // assert retry exchange
    await channel.assertExchange(this.exchangeName, this.exchangeType);
    // assert and bind target queue with retry exchange DLX
    this.dlxExchangeName = `${this.exchangeName}-DLX`;
    this.dlxExchangeType = 'topic';
    await channel.assertExchange(this.dlxExchangeName, this.dlxExchangeType);
    const routingKey = `${this.routingKey}.#`;
    await channel.bindQueue(this.queueName, this.dlxExchangeName, routingKey);

    // assert retrying queue and move to retry dlx after 5s
    const waitQueueName = `retry-5s`;
    const timeDelay = 5000;
    const routingKeyRetry = `#.retry`;
    await channel.assertQueue(waitQueueName, {
      arguments: {
        'x-dead-letter-exchange': this.dlxExchangeName,
        'x-message-ttl': timeDelay,
      },
    });
    await channel.bindQueue(waitQueueName, this.exchangeName, routingKeyRetry);
  }
}
