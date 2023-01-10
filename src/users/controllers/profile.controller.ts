import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/auth/models/roles.model';
import { PayloadToken } from 'src/auth/models/token.model';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRoles.STUDENT)
  @Get('my-notes')
  async getNotes(@Req() req: Request) {
    const user = req.user as PayloadToken;
    const data = await this.usersService.findByIdNumber(user.sub);

    const { password, ...result } = data.toJSON();

    return result;
  }
}
