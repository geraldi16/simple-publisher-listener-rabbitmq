import { Inject, Injectable } from '@nestjs/common';
import { RabbitMQPublisher } from './common/publisher/RabbitMQPublisher';

@Injectable()
export class AppService {
  constructor(
    @Inject('hello-world-provider')
    private readonly helloworldPublisher: RabbitMQPublisher,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async publishHello(): Promise<string> {
    await this.helloworldPublisher.publish(JSON.stringify({ message: 'hello world' }));
    return 'successfully sent to messager';
  }
}
