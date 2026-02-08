import { IsString, IsOptional, MaxLength } from 'class-validator';

export class StartTimerDto {
  @IsString()
  taskId: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

export class StopTimerDto {
  @IsString()
  timeEntryId: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}