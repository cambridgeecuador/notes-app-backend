import { Injectable } from '@nestjs/common';
import { PayloadToken } from 'src/auth/models/token.model';

import { generateIdNumber } from 'src/common/generateIdNumber';
import { UpdateUserDto } from 'src/users/dto/user/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class EmailService {
  constructor(private usersService: UsersService) {}

  async resetPassword(idNumber: string) {
    const data = await this.usersService.findByIdNumber(idNumber);
    const user = (await data.toJSON()) as any;
    const newPassword = generateIdNumber();

    const { _id, email } = user;
    const updatedUser = this.usersService.update(_id, {
      password: newPassword,
    } as UpdateUserDto);

    if (!updatedUser) {
      throw new Error('Error updating user');
    }
    return { newPassword, email };
  }

  async getUser(idNumber: string) {
    const data = await this.usersService.findByIdNumber(idNumber);
    const user = (await data.toJSON()) as any;
    const { email } = user;

    return { email };
  }
}
