import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from '../../services/chat.service';
import { UserDto } from 'src/dtos/user.dtos/User.dto';
import { CreateMessage } from 'src/dtos/message.dtos/CreateMessage.dto';
import { ObjectId } from 'mongodb';
import { UserService } from 'src/services/user.service';
const moment = require('moment');

@WebSocketGateway({ cors: '*' })
@UsePipes(new ValidationPipe({ transform: true }))
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer() webServer: Server;
  async handleConnection() {}
  async handleDisconnect(socket: Socket) {
    try {
      console.log("socke-id : ",socket.id)
      const data = await this.chatService.Logout({ socket_id: socket.id });
      if(data){
        socket.leave(`room_${data}`);
        console.log("User - "+data+" logged out.")
        const onlineUsers = await this.userService.GetAllOnlineUsers();
        const user = await this.userService.GetUserProfile(data);
        this.webServer.emit('user-activity', {
          message: `${user.profile.name} logged in.`,
          onlineUsers: onlineUsers,
        });
      }
    } catch (error) {
      socket._error(error);
    }
  }

  //when user logs in create chat room. So they can send messages anytime in the create chat room
  @SubscribeMessage('login')
  async onLogin(socket: Socket, data: UserDto) {
    try {
      await this.chatService.UpdateLoginUser(socket, data);
      socket.join(`room_${data._id}`);
      const onlineUsers = await this.userService.GetAllOnlineUsers();
      const user = await this.userService.GetUserProfile(data._id);
      this.webServer.emit('user-activity', {
        message: `${user.profile.name} logged in.`,
        onlineUsers: onlineUsers,
      });
      console.log(
        'User - ' + data._id + ' has joined room :-> room_',
        data._id,
      );
      return ({
        success:true,
        message:"Login successful"
      })
    } catch (error) {
      socket._error(error);
      return ({
        success:false,
        message:error.message
      })
    }
  }

  @SubscribeMessage('sendMessage')
  //@ts-ignore
  async sendMessage(socket: Socket, data: CreateMessage) {
    try {
      console.log('Called');
      const messageData = {
        sender: new ObjectId(data.sender),
        receiver: new ObjectId(data.receiver),
        data: data.data,
      };
      const message = await this.chatService.CreateMessage(messageData);
      //@ts-ignore
      console.log("ddede->",message.createdAt)
      //@ts-ignore
      console.log("Time->",moment(message.createdAt).format('hh:mm a'))
      let messageResult = await this.chatService.GetMessage(message._id.toString())
      const isReceiverOnline = await this.chatService.CheckUserOnline(
        new ObjectId(data.receiver),
      );
      const resp = await new Promise((resolve, reject) => {
        if (isReceiverOnline) {
          // receiver is online...........
          console.log('Receiver is online,,');
          socket.timeout(20000)
            .to(`room_${data.receiver}`)
            .emit('newMessage', messageResult, async (error:any,data: any) => {
              if (data[0]) {
                // case-0 :--  Message is delivered and seen.
                console.log('Data from callback of newMessage : ', data);
                const updatedMsg = await this.chatService.MarkReadMessage(data[0]);
                messageResult = await this.chatService.GetMessage(updatedMsg._id.toString())
                resolve({
                  isRead: true,
                  message: messageResult,
                  info:"Receiver is online"
                });
              } else {
                // case-1 :-- Message is delivered but not seen.
                console.log('called------');
                resolve({
                  isRead: false,
                  message: messageResult,
                  info:"Receiver is online"
                });
              }
            });
        } else {
          // receiver is offline............
          console.log('Receiver is offline.');
          resolve({
            isRead:false,
            message:messageResult,
            info:"Receiver is offline"
          });
        }
      });
      console.log('resp->', resp);
      return({
        success:true,
        data:resp
      })
    } catch (error) {
      console.log('Error->', error);
      socket._error(error);
      return({
        success:false,
        message:error.message
      })
    }
  }

  @SubscribeMessage('logout')
  async onLogout(socket: Socket, data: { userId: string }) {
    try {
      await this.chatService.LogoutUser(data.userId);
      const user = await this.userService.GetUserProfile(data.userId);
      const onlineUsers = await this.userService.GetAllOnlineUsers();
      this.webServer.emit('user-activity', {
        message: `${user.profile.name} logged out.`,
        onlineUsers: onlineUsers,
      });
      socket.leave(`room_${data.userId}`);
      console.log('User ' + user.profile._id + ' logged out.');
      return ({
        success:true,
        message:"Logout successful"
      })
    } catch (error) {
      console.log('Error --> ', error);
      socket._error(error);
      return({
        success:false,
        message:error.message
      })
    }
  }
}
