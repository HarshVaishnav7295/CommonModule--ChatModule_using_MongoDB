import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { RegisterUserDto } from 'src/dtos/user.dtos/RegisterUser.dto';
import { AuthService } from 'src/services/auth.service';
import { Request, Response } from 'express';
import { UserService } from 'src/services/user.service';
import { LoginDto } from 'src/dtos/user.dtos/LoginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiOkResponse } from '@nestjs/swagger';
import { IRegisterUser } from 'src/interfaces/RegisterUser.interface';
import { ILoginUser } from 'src/interfaces/LoginUser.interface';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService
  ) {}


  @Post('/register')
  @ApiOkResponse({
    type:IRegisterUser
  })
  async registerUser(@Body() body: RegisterUserDto, @Res() res: Response) {
    try {
      if (!body.email || !body.name || !body.password) {
        return res.status(400).json({
          success: false,
          error: 'Please provide all fields email,name.password.',
        });
      } else {
        const userExists = await this.userService.UserExists(body.email);
        if (userExists.success) {
          return res.status(400).json({
            success: false,
            error: 'User with this email already exists.',
          });
        } else {
          const { user, success, error, statusCode } =
            await this.authService.RegisterUser(body);
          return res.status(statusCode).json({
            success,
            error,
            user,
          });
        }
      }
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
        user: null,
      });
    }
  }

  @Post('/login')
  @ApiOkResponse({
    type:ILoginUser
  })
  async loginUser(@Body() body: LoginDto, @Res() res: Response) {
    try {
      if (!body.email || !body.password) {
        return res.status(400).json({
          success: false,
          error: 'Please provide both email and password.',
          user: null,
          accessToken: null,
        });
      } else {
        const { statusCode, success, error, user, accessToken } =
          await this.authService.LoginUser(body);
        return res.status(statusCode).json({
          success,
          error,
          accessToken,
          user,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
        user: null,
        accessToken: null,
      });
    }
  }


}
