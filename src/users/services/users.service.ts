import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { generateIdNumber } from '../../common/generateIdNumber';
import { FilterUsersDto } from '../dto/user/filter-users.dto';
import { dotify } from '../../common/dot';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userRepository: Model<User>) {}

  findAll(params?: FilterUsersDto) {
    if (!params) {
      return this.userRepository.find().sort({ createdAt: -1 }).exec();
    }

    const filters: FilterQuery<User> = {};
    const { limit, offset } = params;

    if (params.status) {
      filters.status = params.status;
    }

    if (params.idNumber) {
      filters.idNumber = params.idNumber;
    }

    return this.userRepository
      .find(filters)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  findOne(id: string) {
    return this.userRepository.findById(id).exec();
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const hashedUser = { ...createUserDto, password: hashPassword };

    const newUser = new this.userRepository({
      ...hashedUser,
      idNumber: generateIdNumber(),
    });

    return newUser.save();
  }

  async findByIdNumber(idNumber: string) {
    const user = await this.userRepository.findOne({ idNumber }).exec();
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const newData = { ...updateUserDto };

    if (updateUserDto.password) {
      newData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = this.userRepository
      .findByIdAndUpdate(id, { $set: dotify(newData) }, { new: true })
      .exec();

    return user;
  }

  remove(id: string) {
    return this.userRepository.findByIdAndDelete(id).exec();
  }
}
