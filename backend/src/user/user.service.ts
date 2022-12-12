import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcrypt';
import { Model } from 'mongoose';
import { UserModel, UserRoleEnum } from './user.model';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UploadService } from 'upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
    private readonly uploadService: UploadService,
    private readonly jwtService: JwtService
  ) {}

  async findAll(userId: string): Promise<UserModel[]> {
    try {
      const user = await this.userModel.findById(userId).populate('uploads');

      this.checkUserPermission(user.role);

      const allUsers = await this.userModel.find().populate('uploads').exec();

      return allUsers;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findById(id: string): Promise<UserModel> {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new HttpException(`${id} is not a valid _ID.`, 400);
      }

      const user = await this.userModel.findById(id);

      if (!user) {
        throw new HttpException(`User not found`, 400);
      }

      return user;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findByEmail(email: string): Promise<UserModel> {
    try {
      const user = await this.userModel.findOne({ email }).select('+password');
      if (!user) {
        throw new HttpException('User not found', 400);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async create(data: CreateUserDto, userId?: string): Promise<CreateUserDto> {
    try {
      const user = await this.userModel.findById(userId);

      if (userId) {
        this.checkUserPermission(user.role);
      }

      const hasUser = await this.userModel.findOne({ email: data.email });

      if (hasUser) {
        throw new HttpException('Email unavailable', 400);
      }

      const record = new this.userModel();
      record.name = data.name;
      record.email = data.email;
      record.password = hashSync(data.password, 10);
      record.role = data.role;
      record.token = await this.jwtToken(record);

      const newUser = await this.userModel.create(record);

      return newUser.save();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async update(
    id: string,
    data: UpdateUserDto,
    userId?: string
  ): Promise<UpdateUserDto> {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new HttpException(`ID #${id} is not a valid _ID.`, 400);
      }

      const user = await this.userModel.findById(userId);

      if (userId && userId !== id) {
        this.checkUserPermission(user.role);
      }

      const userToUpdate = await this.userModel.findByIdAndUpdate(id, data);

      if (!userToUpdate) {
        throw new HttpException(`User not found`, 400);
      }

      return await this.findById(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new HttpException(`ID #${id} is not a valid _ID.`, 400);
      }

      const user = await this.userModel.findById(userId);

      if (userId !== id) {
        this.checkUserPermission(user.role);
      }

      const userToDelete = await this.findById(id);

      if (!userToDelete) {
        throw new HttpException(`User not found`, 400);
      }

      await this.uploadService.deleteMany(id);

      await this.userModel.deleteOne({ _id: userToDelete.id });

      return {
        message: `User ${id} successfully deleted`
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async jwtToken(user: UserModel): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.signAsync(payload);
  }

  private checkUserPermission(role: UserRoleEnum): void {
    if (role !== UserRoleEnum.ADMIN) {
      throw new HttpException(`You don't have permission to access`, 403);
    }
  }

  async createUserAdmin() {
    const hasAdmin = await this.userModel.findOne({ email: 'admin@test.com' });

    if (hasAdmin) {
      console.log('Admin User has already been created');
      return;
    }

    const adminData: CreateUserDto = {
      name: 'Admin',
      email: 'admin@test.com',
      role: UserRoleEnum.ADMIN,
      password: 'admin'
    };

    await this.create(adminData).finally(() =>
      console.log('Admin User created successfully')
    );
  }
}
