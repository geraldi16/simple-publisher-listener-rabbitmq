import { Injectable } from '@nestjs/common';
import { MessageHandler } from '../common/MessageHandler';

@Injectable()
export class HelloWorldListenerHandler implements MessageHandler {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async handleMessage(messageString: string) {
    console.log(messageString);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleError(error: any, message: any): boolean | Promise<boolean> {
    return true;
  }
}
