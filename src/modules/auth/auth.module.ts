import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {User,UserSchema} from '../../schemas/user.schema'
import { UserModule } from '../user/user.module';
import { AuthService } from 'src/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
@Module({
  imports:[MongooseModule.forFeature([
    {
      name : User.name,
      schema : UserSchema
    }
  ]),UserModule,JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '3d' },
  })],
  controllers: [AuthController],
  exports : [AuthService],
  providers:[AuthService]
})
export class AuthModule {}
