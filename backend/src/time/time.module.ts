import { Module } from '@nestjs/common';
import { TimeController } from './time.controller';
import { TimeService } from './time.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TimeController],
  providers: [TimeService, PrismaService],
  exports: [TimeService],
})
export class TimeModule {}