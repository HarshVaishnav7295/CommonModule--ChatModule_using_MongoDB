import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from 'src/services/chat.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Message, MessageSchema } from 'src/schemas/message.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {
      name : User.name,
      schema : UserSchema
    },
    {
      name : Message.name,
      schema : MessageSchema
    }
  ]),UserModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
