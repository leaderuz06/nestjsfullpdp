import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { PaginationUserDto } from './dto/pagination-user.dto';
import { DEFAULT_USER_SIZE } from 'utils/constants';
import argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async updateHashedRefreshToken(userId: number, hashedRefreshToken: string|null) {
    return await this.userRepository.update({id: userId}, { hashedRefreshToken });
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email }})
    if(existingUser) throw new ConflictException('User with this email already exists');
    const existingPhoneNumber = await this.userRepository.findBy({ phone: createUserDto.phone})
    if(existingPhoneNumber.length > 0) throw new ConflictException('User with this phone number already exists');
    const user = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(paginationUserDto: PaginationUserDto) {
    return await this.userRepository.find({ skip: paginationUserDto.skip, take: paginationUserDto.limit ?? DEFAULT_USER_SIZE});
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if(!user) throw new NotFoundException('User with this email does not exist');
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if(!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id })
    if(!user) throw new NotFoundException('User not found');
    if(updateUserDto.email){
      const existingUser = await this.userRepository.findOne({ where: { email: updateUserDto.email, id: Not(id) }})
      if(existingUser) throw new ConflictException('User with this email already exists');      
    }
    if(updateUserDto.phone){
      const existingPhoneNumber = await this.userRepository.findBy({ phone: updateUserDto.phone, id: Not(id)})
      if(existingPhoneNumber.length > 0) throw new ConflictException('User with this phone number already exists');
    }
    if(updateUserDto.password){
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    }
    const updateUser = await this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(updateUser);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if(!user) throw new NotFoundException('User not found');
    await this.userRepository.softDelete(id);
    return { message: 'User deleted successfully' };
  }
}
