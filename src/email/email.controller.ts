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
      html: `<b>Your temporal password is:</b> <span>${newPassword}</span>`,
    });

    return { message: `Email sent to ${email}` };
  }

  @Roles(UserRoles.ADMIN)
  @Get('aprove-user')
  async aproveUser(@Query('idNumber') idNumber) {
    const { email } = await this.emailService.aproveUser(idNumber);

    const html = `
      <body style="color: #000000">
        <h2><b>Welcome to Cambrigde Results</b></h2>
        <h3>This is your ID number: ${idNumber}</h3> 
        <img 
          style="width: 100px; height: 100px;"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg/513px-Coat_of_Arms_of_the_University_of_Cambridge.svg.png" alt="Cambridge Logo"
        />
        <h4>Please log into the platform <a href="https://cambridge-results.com/">https://cambridge-results.com/</a></h4>
      </body>
    `;

    await this.mailerService.sendMail({
      to: email,
      from: 'info@cambridge-results.com',
      subject: 'User approved',
      html,
    });

    return { message: `Email sent to ${email}` };
  }
}
