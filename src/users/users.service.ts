import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async findOne(id: string): Promise<User> {
    return this.findById(id);
  }

  async updateEmail(id: string, newEmail: string): Promise<User> {
    const user = await this.findById(id);
    user.email = newEmail;
    return await this.usersRepository.save(user);
  }
}
