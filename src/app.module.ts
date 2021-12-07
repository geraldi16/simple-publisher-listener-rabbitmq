import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common';
import { helloWorldPublisherProvider } from './providers/helloWorldPublisherProvider';

@Module({
  imports: [CommonModule],
  controllers: [AppController],
  providers: [AppService, helloWorldPublisherProvider],
})
export class AppModule {}
