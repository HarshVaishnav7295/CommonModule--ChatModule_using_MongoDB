import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {User,UserSchema} from '../../schemas/user.schema'
import { AuthService } from 'src/services/auth.service';
import { UserController } from './user.controller';
import { UserService } from 'src/services/user.service';

@Module({
  imports:[MongooseModule.forFeature([
    {
      name : User.name,
      schema : UserSchema
    }
  ])],
  controllers: [UserController],
  exports:[UserService],
  providers:[UserService]
})
export class UserModule {}
