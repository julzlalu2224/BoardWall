import { IsString, IsOptional, IsEnum } from 'class-validator';
import { OrgRole } from '@prisma/client';

export class AddMemberDto {
  @IsString()
  userId: string;

  @IsEnum(OrgRole)
  @IsOptional()
  role?: OrgRole;
}