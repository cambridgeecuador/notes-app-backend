import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as Joi from 'joi';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { environments } from './environments';
import config from './config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { host, user, password } = configService.mailer;

        return {
          transport: {
            host,
            secure: true,
            secureConnection: false, // TLS requires secureConnection to be false
            tls: {
                ciphers:'SSLv3'
            },
            requireTLS:true,
            port: 465,
            debug: true,
            auth: {
              user,
              pass: password,
            }
          },
        };
      },
      inject: [config.KEY],
    }),
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        MONGO_INITDB_ROOT_USERNAME: Joi.string().required(),
        MONGO_INITDB_ROOT_PASSWORD: Joi.string().required(),
        MONGO_DB: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        MAILER_HOST: Joi.string().required(),
        MAILER_USER: Joi.string().required(),
        MAILER_PASSWORD: Joi.string().required(),
        MAILER_EMAIL_FROM: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    FilesModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
