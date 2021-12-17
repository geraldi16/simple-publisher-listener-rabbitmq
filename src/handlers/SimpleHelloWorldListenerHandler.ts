import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext, Ctx } from '@nestjs/microservices';

@Injectable()
export class SimpleHelloWorldListenerHandler {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  @MessagePattern('hello-world')
  async handleMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('data', data);
    console.log('context', context.getMessage());
  }
}
