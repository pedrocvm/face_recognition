import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'auth/auth.module';
import { AuthController } from 'auth/auth.controller';
import { AuthMiddleware } from 'auth/auth.middleware';
import { UserController } from 'user/user.controller';
import { UserModule } from 'user/user.module';
import { UploadModule } from 'upload/upload.module';
import { UploadController } from 'upload/upload.controller';
import { AppService } from 'app.service';

const controllers = [AuthController, UserController, UploadController];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    }),
    AuthModule,
    UserModule,
    UploadModule
  ],
  controllers,
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/api/auth/signin', method: RequestMethod.POST },
        { path: '/api/auth/signup', method: RequestMethod.POST }
      )
      .forRoutes(...controllers);
  }
}
