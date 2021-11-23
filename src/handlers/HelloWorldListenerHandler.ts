import { Injectable } from '@nestjs/common';
import { MessageHandler } from '../common/MessageHandler';

@Injectable()
export class HelloWorldListenerHandler implements MessageHandler {
  constructor () {}

  async handleMessage(messageString: string) {
    console.log(messageString);
  }

  handleError(error: any, message: any): boolean | Promise<boolean> {
    return true;
  }
}