import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMQPublisher } from './common/publisher/RabbitMQPublisher';

@Injectable()
export class AppService {
  constructor(
    @Inject('hello-world-provider')
    private readonly helloworldPublisher: RabbitMQPublisher,
    @Inject('simple-hello-world-publisher-provider')
    private readonly simpleHelloWorldPublisher: ClientProxy,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async publishHello(): Promise<string> {
    await this.helloworldPublisher.publish(JSON.stringify({ message: 'hello world' }));
    return 'successfully sent to messager';
  }

  async simplePublishHello(): Promise<string> {
    await this.simpleHelloWorldPublisher.send('hello-world', { message: 'hello world simple' });
    console.log('simple message sent!');
    return 'successfully sent to messager';
  }
}
