import { Module } from '@nestjs/common';
import { SSMService } from './ssm.service';

@Module({
  providers: [SSMService],
  exports: [SSMService],
})
export class SSMModule {}
