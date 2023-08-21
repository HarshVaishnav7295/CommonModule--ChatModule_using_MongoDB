import { Controller, Get,Post, Res,Req, UseGuards, Body, Param, Delete } from '@nestjs/common';
import { ChatService } from 'src/services/chat.service';
import { UserService } from 'src/services/user.service';
import { Response,Request } from 'express';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { GetConversationWithDTO } from 'src/dtos/message.dtos/GetConversationWith.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { IGetConversationWith } from 'src/interfaces/GetConversationWith.interface';
import { IDeleteMessage } from 'src/interfaces/DeleteMessage.interface';
import { IClearMyChat } from 'src/interfaces/ClaerMyChat.interface';

@Controller('api/chat')
@UseGuards(AuthenticationGuard)
export class ChatController {
  constructor(private readonly userService: UserService, private readonly chatService : ChatService){}

    @Get('/getConversationWith/:id')
    @ApiOkResponse({
        type : IGetConversationWith
    })
    @ApiBearerAuth()
    async getMyConversationWithUser(@Req() req:Request,@Param() param:GetConversationWithDTO,@Res() res:Response){
        try{
            const userId = req['user']
            const messages = await this.chatService.GetMyConversationWithUser(userId,param.id)
            return res.status(200).json({
                success: true,
                data: messages
            });
        }catch(error:any){
            return res.status(500).json({
                success: false,
                error: error.message,
                data: []
            });
        }
    }
    
    @Delete('/deleteMessage/:id')
    @ApiOkResponse({
        type : IDeleteMessage
    })
    @ApiBearerAuth()
    async deleteMessage(@Req() req:Request,@Param() param:GetConversationWithDTO,@Res() res:Response){
        try{
            const userId = req['user']
            const message = await this.chatService.GetMessage(param.id)
            if(message){
                const isDeleted = await this.chatService.DeleteMessage(userId,param.id)
                return res.status(200).json({
                    isDeleted: isDeleted,
                    message:"Message deleted successfully"
                });
            }else{
                return res.status(200).json({
                    success:false,
                    message:"No message found."
                });
            }
        }catch(error:any){
            return res.status(500).json({
                success: false,
                error: error.message,
                data: []
            });
        }
    }

    @Post('/clearChatWith/:id')
    @ApiOkResponse({
        type : IClearMyChat
    })
    @ApiBearerAuth()
    async clearMyChatWithUser(@Req() req:Request,@Param() param:GetConversationWithDTO,@Res() res:Response){
        try{
            const userId = req['user']
            const isCleared = await this.chatService.ClearMyChatWithUser(userId,param.id)
            return res.status(200).json({
                isCleared: isCleared
            });
        }
        catch(error:any){
            return res.status(500).json({
                success: false,
                error: error.message,
                data: []
            });
        }
    }

    
}
