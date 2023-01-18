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

    const imageUrl = 'https://students-pdf.s3.sa-east-1.amazonaws.com/assets/reset-password.png';
    const html = customEmail(imageUrl, newPassword)

    await this.mailerService.sendMail({
      to: email,
      from: 'info@cambridge-results.com',
      subject: 'Reset password',
      html,
    });

    return { message: `Email sent to ${email}` };
  }

  @Roles(UserRoles.ADMIN)
  @Get('aprove-user')
  async aproveUser(@Query('idNumber') idNumber) {
    const { email } = await this.emailService.getUser(idNumber);
    const imageUrl = "https://students-pdf.s3.sa-east-1.amazonaws.com/assets/register.png"
    const html = customEmail(imageUrl, "")
    await this.mailerService.sendMail({
      to: email,
      from: 'info@cambridge-results.com',
      subject: 'User approved',
      html,
    });

    return { message: `Email sent to ${email}` };
  }

  @Roles(UserRoles.ADMIN)
  @Get('update-grades')
  async updateGrades(@Query('idNumber') idNumber) {
    const { email } = await this.emailService.getUser(idNumber);
    const imageUrl = "https://students-pdf.s3.sa-east-1.amazonaws.com/assets/results-ready.png"
    const html = customEmail(imageUrl, "")
    await this.mailerService.sendMail({
      to: email,
      from: 'info@cambridge-results.com',
      subject: 'Grades updated',
      html,
    });

    return { message: `Email sent to ${email}` };
  }
}

const customEmail = (imageUrl:string, newPassword:string) => (
  `
  <html>
  <head>
      <style>
          body{
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          a{
              text-decoration: none;
          }

          .container{
              display: block;
              width: 100vw;
              max-width: 1195px;
              height: 50vw;
              max-height: 595px;
              position: relative;
              background-image: url('${imageUrl}');
              background-size: cover;
              background-position: center;
          }

          .text{
            color: white;
            font-size: 2em;
            color: #000A25;
            font-weight: 600;
            padding-top: 37.5%;
            padding-left: 5%;
        }
      </style>
  </head>
  <body>
      <a href="cambridge-results.com">
          <div class="container">
              <h3 class="text">${newPassword}</h3>
          </div>
      </a>
  </body> 
</html>
`)