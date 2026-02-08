import { IsString, IsOptional, MaxLength } from 'class-validator';

export class StopTimerDto {
  @IsString()
  timeEntryId: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}