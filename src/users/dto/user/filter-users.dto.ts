import { IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { UserStatus } from 'src/users/utils/user.interface';

export class FilterUsersDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;

  @IsOptional()
  @IsString()
  status: UserStatus;

  @IsOptional()
  @IsString()
  idNumber: string;
}
