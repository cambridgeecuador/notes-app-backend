import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  NotFoundException,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe';
import { FilterUsersDto } from '../dto/user/filter-users.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/auth/models/roles.model';
import { IsPublic } from 'src/auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(
  new SanitizeMongooseModelInterceptor({
    excludeMongooseId: false,
    excludeMongooseV: true,
  }),
)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return newUser;
  }

  @Roles(UserRoles.ADMIN)
  @Get()
  async findAll(@Query() params: FilterUsersDto) {
    return await this.usersService.findAll(params);
  }

  @Roles(UserRoles.ADMIN, UserRoles.STUDENT)
  @Get(':userId')
  async findOne(@Param('userId', MongoIdPipe) userId: string) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Roles(UserRoles.ADMIN, UserRoles.STUDENT)
  @Put(':userId')
  async update(
    @Param('userId', MongoIdPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const newUser = await this.usersService.update(userId, updateUserDto);

    if (!newUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return newUser;
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':userId')
  async remove(@Param('userId', MongoIdPipe) userId: string) {
    const userRemoved = await this.usersService.remove(userId);

    if (!userRemoved) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return userRemoved;
  }
}
