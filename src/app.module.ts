import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService,ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath : `.env`
    }),
    AuthModule,UserModule,
     MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory : (config:ConfigService)=>({
        uri:config.get<string>('DB_URL'),
      })
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port : 587,
        auth: {
          user: 'techtic.harshvaishnav@gmail.com',
          pass: 'qbgujzbzpghfmkaj',
        },
      },
    }),
    UserModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
