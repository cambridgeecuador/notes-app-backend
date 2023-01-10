import { IsString, IsOptional, IsPositive } from 'class-validator';

export class UserDetailsDto {
  @IsString()
  @IsOptional()
  qualification: string;

  @IsString()
  @IsOptional()
  result: string;

  @IsPositive()
  @IsOptional()
  overallScore: number;

  @IsString()
  @IsOptional()
  pdf: string;
}
