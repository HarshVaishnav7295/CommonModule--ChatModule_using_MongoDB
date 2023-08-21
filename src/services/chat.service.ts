import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UserService } from './user.service';
import { ObjectId } from 'mongodb';
import { Socket } from 'socket.io';
import { Message } from 'src/schemas/message.schema';
import { CreateMessage } from 'src/dtos/message.dtos/CreateMessage.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(User.name) private userModel: Model<Document>,
    private userService: UserService,
    @InjectModel(Message.name) private messageModel: Model<Document>,
  ) {}

  // changing login status of user at time of login.
  async UpdateLoginUser(socket: Socket, data: { _id: string }) {
    const user = await this.userModel.findByIdAndUpdate(
      new ObjectId(data._id),
      {
        isLogedIn: true,
        socketId: socket.id,
      },
    );
  }

  // changing login status of user at time of connection lost.
  async Logout(data: { socket_id: string }) {
    const user = await this.userModel.findOneAndUpdate(
      {
        socketId: data.socket_id,
      },
      {
        isLogedIn: false,
        socketId: '',
      },
    );
    console.log('User->', user);
    return user._id.toString();
  }

  // creating message
  async CreateMessage(data: CreateMessage) {
    const msg = await this.messageModel.create(data);
    return msg;
  }

  // changing read status of message
  async MarkReadMessage(data: Message) {
    const message = await this.messageModel.findByIdAndUpdate(
      //@ts-ignore
      new ObjectId(data._id),
      {
        isRead: true,
      },
      {
        new: true,
      },
    );
    console.log('message--->', message);
    return message;
  }

  // checking user's login status
  async CheckUserOnline(id: ObjectId) {
    const user = await this.userModel.findById<User>(new ObjectId(id));
    return user.isLogedIn;
  }

  // changing login status of user at time of logout.
  async LogoutUser(id: string) {
    const user = await this.userModel.findByIdAndUpdate(new ObjectId(id), {
      isLogedIn: false,
      socketId: '',
    });
  }

  // get messages between users -- by taking deletedby in count also
  async GetMessages(currentUserId: string, userId: string): Promise<Message[]> {
    return await this.messageModel.aggregate([
      {
        $match: {
          $and: [
            {
              deletedBy: {
                $nin: [currentUserId],
              },
            },
            {
              $or: [
                {
                  sender: new ObjectId(currentUserId),
                  receiver: new ObjectId(userId),
                },
                {
                  sender: new ObjectId(userId),
                  receiver: new ObjectId(currentUserId),
                },
              ],
            },
          ],
        },
      },
    ]);
  }

  // get my conversation with user
  async GetMyConversationWithUser(currentUserId: string, userId: string) {
    console.log("userid",userId)
    let messages = await this.GetMessages(currentUserId, userId);
    messages = await Promise.all<Message>(
      messages.map(async (it) => {
        if (it.sender && it.receiver) {
          let senderProfile = await this.userService.GetUserProfile(
            it.sender.toString(),
          );
          let receiverProfile = await this.userService.GetUserProfile(
            it.receiver.toString(),
          );
          //@ts-ignore
          it['sender'] = senderProfile.profile;
          //@ts-ignore
          it['receiver'] = receiverProfile.profile;
          return it;
        } else {
          return null;
        }
      }),
    );
    messages = messages.filter((it) => it);
    return messages;
  }

  // get message
  async GetMessage(msgid: string) {
    let message = await this.messageModel.findById<Message>(
      new ObjectId(msgid),
    );
    if (message) {
      let senderProfile = await this.userService.GetUserProfile(
        message.sender.toString(),
      );
      let receiverProfile = await this.userService.GetUserProfile(
        message.receiver.toString(),
      );
      //@ts-ignore
      message['sender'] = senderProfile.profile;
      //@ts-ignore
      message['receiver'] = receiverProfile.profile;
      return message;
    } else {
      return null;
    }
  }

  // delete message
  async DeleteMessage(currentUserId: string, msgid: string) {
    try {
      let message = await this.messageModel.findOne<Message>({
        $or: [
          {
            _id: new ObjectId(msgid),
            sender: new ObjectId(currentUserId),
          },
          {
            _id: new ObjectId(msgid),
            receiver: new ObjectId(currentUserId),
          },
        ],
      });
      if (message) {
        let deletedBy = message.deletedBy ? message.deletedBy : [];
        if (!deletedBy.includes(currentUserId.toString())) {
          deletedBy.push(currentUserId.toString());
        }
        let updatedMsg = await this.messageModel.findOneAndUpdate<Message>(
          {
            _id: new ObjectId(msgid),
          },
          {
            deletedBy: deletedBy,
          },
        );
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.log('Error while deleting message:', error.message);
      return false;
    }
  }

  // clear my chat with user.
  async ClearMyChatWithUser(currentUserId: string, userId: string) {
    try {
      let messages = await this.GetMessages(currentUserId, userId);
      messages.map(async (it) => {
        //@ts-ignore
        const deleted = await this.DeleteMessage(currentUserId, it._id);
      });
      return true;
    } catch (error: any) {
      console.log('Error while deleting message:', error.message);
      return false;
    }
  }

}
