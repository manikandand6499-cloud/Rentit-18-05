import { Module } from '@nestjs/common';
import { SpeechService } from './speech.service';
import { SpeechController } from './speech.controller';
import { SpeechGateway } from './speech.gateway';

@Module({
  controllers: [SpeechController],
  providers: [SpeechService, SpeechGateway],
  exports: [SpeechService],
})
export class SpeechModule {}