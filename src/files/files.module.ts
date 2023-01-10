import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileSchema } from './entities/file.entity';
import { FileController } from './controllers/files.controller';
import { FilesService } from './services/files.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'File',
        schema: FileSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [FileController],
  providers: [FilesService],
})
export class FilesModule {}
