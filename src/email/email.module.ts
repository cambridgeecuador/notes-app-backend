import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [UsersModule, MailerModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
