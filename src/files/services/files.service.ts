import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigType } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { ObjectId } from 'mongodb';

import { File } from '../entities/file.entity';
import config from 'src/config';

@Injectable()
export class FilesService {
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly region: string;
  private readonly bucket: string;

  constructor(
    @InjectModel(File.name) private fileRepository: Model<File>,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    this.accessKeyId = this.configService.aws.accessKeyId;
    this.secretAccessKey = this.configService.aws.secretAccessKey;
    this.region = this.configService.aws.region;
    this.bucket = this.configService.aws.bucket;
  }

  async getLinkFileByIdNumber(idNumber: string) {
    const s3 = this.getS3();
    const file = await this.findByIdNumber(idNumber);
    const { key } = file;

    return s3.getSignedUrl('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: 60 * 60 * 12,
    });
  }

  async updateACL(fileId: string) {
    const file = await this.findByIdNumber(fileId);
    const s3 = this.getS3();
    const params = {
      Bucket: this.bucket,
      Key: file.key,
      ACL: 'public-read',
    };

    s3.putObjectAcl(params, (err, data) => (err ? err : data));

    return `${s3.endpoint.protocol}//${this.bucket}.${s3.endpoint.hostname}/${file.key}}`;
  }

  async upload(file, idNumber: string) {
    const objectId = new ObjectId();
    const arr_name = file.originalname.split('.');
    const extension = arr_name.pop();
    const name = arr_name.join('.');
    const key = `${objectId}/${this.slug(name)}.${extension}`;

    const data = {
      _id: objectId,
      idNumber,
      name,
      fileName: String(file.originalname),
      mimeType: file.mimetype,
      size: file.size,
      key,
    };

    await this.uploadS3(file.buffer, key, file.mimeType);

    try {
      const existentFile = await this.findByIdNumber(idNumber);

      const newFile = await this.fileRepository.findByIdAndUpdate(
        existentFile._id,
        { ...data, _id: existentFile._id },
        { new: true },
      );
      console.log(newFile);

      return newFile;
    } catch (err) {
      if (err instanceof NotFoundException) {
        console.log('File not found');
      }
      console.log(err);
    }
    return await this.fileRepository.create(data);
  }

  async deleteFileS3(idNumber) {
    const file = await this.findByIdNumber(idNumber);
    const s3 = this.getS3();
    const params = {
      Bucket: this.bucket,
      Key: file.key,
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    s3.deleteObject(params, (err, data) => {});
    await file.remove();
    await this.fileRepository.deleteOne({ idNumber }).exec();
    return true;
  }

  private async uploadS3(file_buffer, key, content_type) {
    const s3 = this.getS3();
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: file_buffer,
      ContentType: content_type,
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  async findByIdNumber(idNumber: string) {
    const file = await this.fileRepository.findOne({ idNumber }).exec();

    if (!file) {
      throw new NotFoundException();
    }

    return file;
  }

  async getAll() {
    return await this.fileRepository.find().exec();
  }

  private getS3() {
    return new S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region,
    });
  }

  private slug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;';
    const to =
      'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }
}
