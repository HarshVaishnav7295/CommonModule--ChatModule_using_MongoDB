import { Controller, Get, Res,Req,Body, UseGuards, Patch, Delete, Post } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { Response,Request } from 'express';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { ComparePassword } from 'src/helpers/hashPassword.helper';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ILogout } from 'src/interfaces/Logout.interface';
@Controller('api/user')
@UseGuards(AuthenticationGuard)
export class UserController {
    constructor(private userService:UserService){}

    @Post('/logout')
    @ApiBearerAuth()
    @ApiOkResponse({
        type:ILogout
    })
  async logout(@Req() req:Request,@Res() res:Response){
    try{
      const userId = req['user']
      console.log("user",userId)
      await this.userService.Logout(userId)
      return res.status(200).json({
        success:true,
        message:"Logout successful"
      })
    }catch(error:any){
      return res.status(500).json({
        success:false,
        error:error.message
      })
    }
  }
}
