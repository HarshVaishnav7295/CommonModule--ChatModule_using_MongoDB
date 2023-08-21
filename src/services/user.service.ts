import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserProfileDto } from 'src/dtos/user.dtos/UserProfile.dto';
import { UserDto } from 'src/dtos/user.dtos/User.dto';


@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<Document>) {}

  async UserExists(email: string): Promise<{
    success: boolean;
    user: UserProfileDto;
    error: string;
  }> {
    try {
      const user = await this.userModel.findOne<UserProfileDto>(
        {
          email: email,
        },
        { password: 0 },
      );
      if (user) {
        return {
          success: true,
          user,
          error: 'Email already in use',
        };
      } else {
        return {
          success: false,
          user: null,
          error: 'No user found.',
        };
      }
    } catch (error: any) {
      return {
        user: null,
        success: false,
        error: error.message,
      };
    }
  }

  async GetUserProfile(userId: string): Promise<{
    success: boolean;
    profile: UserProfileDto;
    error: any;
    statusCode: number;
  }> {
    try {
      const profile = await this.userModel.findOne<UserProfileDto>(
        {
          _id: new ObjectId(userId),
          isDeleted: false,
        },
        {
          password: 0,
        },
      );
      if (profile) {
        return {
          success: true,
          profile,
          error: null,
          statusCode: 200,
        };
      } else {
        return {
          success: false,
          profile: null,
          error: 'No profile with this id',
          statusCode: 400,
        };
      }
    } catch (error: any) {
      return {
        success: true,
        profile: null,
        error: error.message,
        statusCode: 500,
      };
    }
  }

  async CheckUser({
    id,
    email,
  }: {
    id: string;
    email: string;
  }): Promise<UserDto> {
    const user = await this.userModel.findOne<UserDto>({
      _id: id,
      email: email,
      isDeleted: false,
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async GetAllOnlineUsers(): Promise<
    { id: ObjectId; name: string; email: string }[]
  > {
    const users = await this.userModel.find<User>({
      isLogedIn: true,
      isDeleted: false,
    });
    let data = await Promise.all(
      users.map((it) => {
        return {
          //@ts-ignore
          id: it._id,
          name: it.name,
          email: it.email,
        };
      }),
    );
    data = data.filter((it) => it);
    return data;
  }

  async Logout(userId: string) {
    await this.userModel.findByIdAndUpdate(new ObjectId(userId), {
      isLogedIn: false,
    });
  }
}
