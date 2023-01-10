import { PartialType } from '@nestjs/swagger';
import { UserDetailsDto } from './user-details.dto';

export class UpdateUserDetailsDto extends PartialType(UserDetailsDto) {}
