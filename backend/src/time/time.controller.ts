import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TimeService } from './time.service';
import { StartTimerDto } from './dto/start-timer.dto';
import { StopTimerDto } from './dto/stop-timer.dto';

@ApiTags('time')
@ApiBearerAuth()
@Controller('time')
@UseGuards(AuthGuard('jwt'))
export class TimeController {
  constructor(private timeService: TimeService) {}

  @Post('start')
  async startTimer(@Request() req, @Body() startTimerDto: StartTimerDto) {
    return this.timeService.startTimer(req.user.id, startTimerDto);
  }

  @Post('stop')
  async stopTimer(@Request() req, @Body() stopTimerDto: StopTimerDto) {
    return this.timeService.stopTimer(req.user.id, stopTimerDto);
  }

  @Get('active')
  async getActiveTimer(@Request() req) {
    return this.timeService.getActiveTimer(req.user.id);
  }

  @Get('entries')
  async getTimeEntries(
    @Request() req,
    @Query('taskId') taskId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.timeService.getTimeEntries(req.user.id, taskId, start, end);
  }

  @Delete('entries/:id')
  async deleteTimeEntry(@Request() req, @Param('id') id: string) {
    return this.timeService.deleteTimeEntry(req.user.id, id);
  }
}