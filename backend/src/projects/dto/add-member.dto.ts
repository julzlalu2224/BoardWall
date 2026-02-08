import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ProjectRole } from '@prisma/client';

export class AddProjectMemberDto {
  @IsString()
  userId: string;

  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole;
}