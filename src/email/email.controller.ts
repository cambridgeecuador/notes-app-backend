import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { PayloadToken } from 'src/auth/models/token.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoles } from 'src/auth/models/roles.model';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UsersService } from 'src/users/services/users.service';
import { EmailService } from './email.service';
import { IsPublic } from 'src/auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('email')
export class EmailController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly emailService: EmailService,
  ) {}

  @IsPublic()
  @Get('reset-password')
  async plainTextEmail(@Query('idNumber') idNumber) {
    const { email, newPassword } = await this.emailService.resetPassword(
      idNumber,
    );

    await this.mailerService.sendMail({
      to: email,
      from: 'info@cambridge-results.com',
      subject: 'Resset password',
      text: `Your temporal password is: ${newPassword} `,
    });

    return { message: `Email sent to ${email}` };
  }

  @Roles(UserRoles.ADMIN)
  @Get('aprove-user')
  async aproveUser(@Query('idNumber') idNumber) {
    const { email } = await this.emailService.aproveUser(idNumber);

    await this.mailerService.sendMail({
      to: email,
      from: 'info@cambridge-results.com',
      subject: 'User approved',
      text: `Your ID Number is: ${idNumber} `,
    });

    return { message: `Email sent to ${email}` };
  }
}
