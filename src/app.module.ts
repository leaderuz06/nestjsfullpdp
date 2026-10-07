import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),

  TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.DATABASE,
    autoLoadEntities: true,
    synchronize: true,
  }),

  UserModule,

  AuthModule,

  ProductModule,

  UploadModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
