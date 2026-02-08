import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRole, ProjectStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    // Check if user has access to organization
    const orgUser = await this.prisma.organizationUser.findFirst({
      where: {
        organizationId: createProjectDto.organizationId,
        userId,
      },
    });

    if (!orgUser) {
      throw new ForbiddenException('Access denied to organization');
    }

    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        organizationId: createProjectDto.organizationId,
        members: {
          create: {
            userId,
            role: ProjectRole.ADMIN,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        tasks: true,
      },
    });
  }

  async findAll(userId: string, organizationId?: string) {
    return this.prisma.project.findMany({
      where: {
        ...(organizationId && { organizationId }),
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        organization: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isMember = project.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async update(id: string, userId: string, updateProjectDto: UpdateProjectDto) {
    await this.checkAdminAccess(id, userId);

    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async delete(id: string, userId: string) {
    await this.checkAdminAccess(id, userId);

    return this.prisma.project.delete({
      where: { id },
    });
  }

  async addMember(projectId: string, userId: string, memberId: string, role: ProjectRole = ProjectRole.MEMBER) {
    await this.checkAdminAccess(projectId, userId);

    return this.prisma.projectMember.create({
      data: {
        projectId,
        userId: memberId,
        role,
      },
    });
  }

  async removeMember(projectId: string, userId: string, memberId: string) {
    await this.checkAdminAccess(projectId, userId);

    return this.prisma.projectMember.deleteMany({
      where: {
        projectId,
        userId: memberId,
      },
    });
  }

  private async checkAdminAccess(projectId: string, userId: string) {
    const projectMember = await this.prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    if (!projectMember || projectMember.role !== ProjectRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
  }
}