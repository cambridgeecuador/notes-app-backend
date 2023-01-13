import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
  },
  mongo: {
    dbName: process.env.MONGO_DB,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    host: process.env.MONGO_HOST,
    connection: process.env.MONGO_CONNECTION,
  },
  jwtSecret: process.env.JWT_SECRET,
  mailer: {
    host: process.env.MAILER_HOST,
    user: process.env.MAILER_USER,
    password: process.env.MAILER_PASSWORD,
    emailFrom: process.env.MAILER_EMAIL_FROM,
  },
}));
