import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/publish')
  async publishHello(@Res() response: Response) {
    await this.appService.publishHello();
    response.send('ok');
  }

  @Get('/publish-simple')
  async publishHelloSimple(@Res() response: Response) {
    const message = await this.appService.simplePublishHello();
    response.send(message);
  }
}
