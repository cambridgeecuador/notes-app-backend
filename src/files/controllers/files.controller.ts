import {
  Post,
  UseInterceptors,
  UploadedFile,
  Controller,
  Get,
  Body,
  Query,
  Put,
  Delete,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../services/files.service';

@Controller('files')
export class FileController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async getFiles() {
    return await this.filesService.getAll();
  }

  // get link of private file
  @Get('access')
  async getLinkAccess(@Query('idNumber') idNumber: string) {
    const url = await this.filesService.getLinkFileByIdNumber(idNumber);

    return {
      url: url,
    };
  }

  // upload single file
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file, @Body() body, @Headers() headers) {
    const { idNumber } = body;
    console.log(headers);

    return await this.filesService.upload(file, idNumber);
  }

  // update permission: public-read
  @Put('update-acl')
  async updateAcl(@Body('fileId') fileId: string) {
    return await this.filesService.updateACL(fileId);
  }

  // delete file
  @Delete('delete')
  async delete(@Query('idNumber') idNumber: string) {
    await this.filesService.deleteFileS3(idNumber);
    return true;
  }
}
