import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from 'user/user.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    await this.userService.createUserAdmin();
  }
}
