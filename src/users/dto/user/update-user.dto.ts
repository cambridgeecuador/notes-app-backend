import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { CreateUserDto } from './create-user.dto';
import { UserStatus } from 'src/users/utils/user.interface';
import { UpdateUserDetailsDto } from '../details/update-user-details.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  status: UserStatus;

  @ValidateNested()
  @IsOptional()
  readonly details: UpdateUserDetailsDto;
}
