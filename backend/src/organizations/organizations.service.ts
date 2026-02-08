import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrgRole } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrganizationDto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: {
        ...createOrganizationDto,
        users: {
          create: {
            userId,
            role: OrgRole.ADMIN,
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.organization.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
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
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
        projects: true,
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    const userInOrg = org.users.find((u) => u.userId === userId);
    if (!userInOrg) {
      throw new ForbiddenException('Access denied');
    }

    return org;
  }

  async update(id: string, userId: string, updateOrganizationDto: UpdateOrganizationDto) {
    await this.checkAdminAccess(id, userId);

    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });
  }

  async delete(id: string, userId: string) {
    await this.checkAdminAccess(id, userId);

    return this.prisma.organization.delete({
      where: { id },
    });
  }

  async addMember(orgId: string, userId: string, memberId: string, role: OrgRole = OrgRole.MEMBER) {
    await this.checkAdminAccess(orgId, userId);

    return this.prisma.organizationUser.create({
      data: {
        organizationId: orgId,
        userId: memberId,
        role,
      },
    });
  }

  async removeMember(orgId: string, userId: string, memberId: string) {
    await this.checkAdminAccess(orgId, userId);

    return this.prisma.organizationUser.deleteMany({
      where: {
        organizationId: orgId,
        userId: memberId,
      },
    });
  }

  private async checkAdminAccess(orgId: string, userId: string) {
    const orgUser = await this.prisma.organizationUser.findFirst({
      where: {
        organizationId: orgId,
        userId,
      },
    });

    if (!orgUser || orgUser.role !== OrgRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
  }
}