import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getMonthlyReport(userId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get time entries for the month
    const timeEntries = await this.prisma.timeEntry.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
        endTime: { not: null },
      },
      include: {
        task: {
          include: {
            project: true,
          },
        },
      },
    });

    // Calculate total hours
    const totalSeconds = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const totalHours = Math.round((totalSeconds / 3600) * 100) / 100;

    // Get tasks completed
    const tasksCompleted = await this.prisma.task.count({
      where: {
        assigneeId: userId,
        status: TaskStatus.DONE,
        updatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Group by project
    const projectStats = timeEntries.reduce((acc, entry) => {
      const projectId = entry.task.project.id;
      const projectName = entry.task.project.name;
      
      if (!acc[projectId]) {
        acc[projectId] = {
          projectId,
          projectName,
          totalSeconds: 0,
          totalHours: 0,
          taskCount: new Set(),
        };
      }
      
      acc[projectId].totalSeconds += entry.duration || 0;
      acc[projectId].taskCount.add(entry.taskId);
      
      return acc;
    }, {});

    const projectData = Object.values(projectStats).map((stat: any) => ({
      projectId: stat.projectId,
      projectName: stat.projectName,
      totalHours: Math.round((stat.totalSeconds / 3600) * 100) / 100,
      taskCount: stat.taskCount.size,
    }));

    return {
      month,
      year,
      totalHours,
      tasksCompleted,
      projectBreakdown: projectData,
      timeEntries: timeEntries.map(entry => ({
        id: entry.id,
        taskTitle: entry.task.title,
        projectName: entry.task.project.name,
        startTime: entry.startTime,
        endTime: entry.endTime,
        duration: entry.duration,
        durationHours: Math.round((entry.duration || 0) / 3600 * 100) / 100,
      })),
    };
  }

  async getProjectReport(userId: string, projectId: string, startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate || new Date();

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          include: {
            timeEntries: {
              where: {
                startTime: {
                  gte: start,
                  lte: end,
                },
              },
            },
            assignee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === TaskStatus.DONE).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalSeconds = project.tasks.reduce((sum, task) => {
      const taskSeconds = task.timeEntries.reduce((s, entry) => s + (entry.duration || 0), 0);
      return sum + taskSeconds;
    }, 0);

    const totalHours = Math.round((totalSeconds / 3600) * 100) / 100;

    return {
      projectId: project.id,
      projectName: project.name,
      startDate: start,
      endDate: end,
      totalTasks,
      completedTasks,
      progress,
      totalHours,
      taskBreakdown: project.tasks.map(task => {
        const taskSeconds = task.timeEntries.reduce((s, entry) => s + (entry.duration || 0), 0);
        return {
          taskId: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          assignee: task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned',
          totalHours: Math.round((taskSeconds / 3600) * 100) / 100,
        };
      }),
    };
  }

  async exportToCSV(userId: string, month: number, year: number): Promise<string> {
    const report = await this.getMonthlyReport(userId, month, year);
    
    let csv = 'Task Title,Project Name,Start Time,End Time,Duration (hours)\n';
    
    report.timeEntries.forEach(entry => {
      csv += `"${entry.taskTitle}","${entry.projectName}","${entry.startTime}","${entry.endTime}",${entry.durationHours}\n`;
    });
    
    return csv;
  }
}