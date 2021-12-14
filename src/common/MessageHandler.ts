import { RabbitMQPublisher } from './publisher/RabbitMQPublisher';

interface RetriableMessage {
  retryCount?: number;
}

export abstract class MessageHandler {
  protected retryExchangePublisher: RabbitMQPublisher;

  abstract handleMessage(message: string): Promise<void>;
  handleError(error, message): boolean | Promise<boolean> {
    const messageString: string = message.content.toString();
    const retriableMessage: RetriableMessage = JSON.parse(messageString);
    const retryCount = (retriableMessage.retryCount || 0) + 1;
    const retryMessage = {
      ...retriableMessage,
      retryCount,
    };

    if (retryCount <= 3) {
      console.log(`Attempt ${retryCount} retry because of ${error.message}`);
      this.retryExchangePublisher.republish(JSON.stringify(retryMessage));
    }

    return true;
  }

  protected _getRetryPublisher(config: any) {
    return new RabbitMQPublisher(
      config.connectionURI,
      config.exchangeName,
      config.exchangeType,
      config.queueName,
      config.routingKey,
      null,
      `Retry Publisher: ${config.name}`,
    );
  }
}
