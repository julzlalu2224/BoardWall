import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartTimerDto } from './dto/start-timer.dto';
import { StopTimerDto } from './dto/stop-timer.dto';

@Injectable()
export class TimeService {
  constructor(private prisma: PrismaService) {}

  async startTimer(userId: string, startTimerDto: StartTimerDto) {
    // Check if task exists and user has access
    const task = await this.prisma.task.findUnique({
      where: { id: startTimerDto.taskId },
      include: {
        project: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const isMember = task.project.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new BadRequestException('Access denied to task');
    }

    // Check if there's already an active timer
    const activeTimer = await this.prisma.timeEntry.findFirst({
      where: {
        userId,
        endTime: null,
      },
    });

    if (activeTimer) {
      throw new BadRequestException('Please stop the current timer before starting a new one');
    }

    return this.prisma.timeEntry.create({
      data: {
        taskId: startTimerDto.taskId,
        userId,
        startTime: new Date(),
        notes: startTimerDto.notes,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async stopTimer(userId: string, stopTimerDto: StopTimerDto) {
    const timeEntry = await this.prisma.timeEntry.findUnique({
      where: { id: stopTimerDto.timeEntryId },
    });

    if (!timeEntry) {
      throw new NotFoundException('Time entry not found');
    }

    if (timeEntry.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    if (timeEntry.endTime) {
      throw new BadRequestException('Timer already stopped');
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - timeEntry.startTime.getTime()) / 1000);

    return this.prisma.timeEntry.update({
      where: { id: stopTimerDto.timeEntryId },
      data: {
        endTime,
        duration,
        notes: stopTimerDto.notes || timeEntry.notes,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async getActiveTimer(userId: string) {
    return this.prisma.timeEntry.findFirst({
      where: {
        userId,
        endTime: null,
      },
      include: {
        task: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getTimeEntries(userId: string, taskId?: string, startDate?: Date, endDate?: Date) {
    return this.prisma.timeEntry.findMany({
      where: {
        userId,
        ...(taskId && { taskId }),
        ...(startDate && {
          startTime: {
            gte: startDate,
          },
        }),
        ...(endDate && {
          startTime: {
            lte: endDate,
          },
        }),
      },
      include: {
        task: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });
  }

  async deleteTimeEntry(userId: string, id: string) {
    const timeEntry = await this.prisma.timeEntry.findUnique({
      where: { id },
    });

    if (!timeEntry) {
      throw new NotFoundException('Time entry not found');
    }

    if (timeEntry.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    return this.prisma.timeEntry.delete({
      where: { id },
    });
  }
}