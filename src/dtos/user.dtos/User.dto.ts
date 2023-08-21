import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  
    @ApiProperty({example:"dede5454e5r4ed"})
    _id : string

    @ApiProperty({example:"harsh"})
    name: string;
  
    @ApiProperty({example:"harsh@gmail.com"})
    email: string;
  
    @ApiProperty({example:"www.google.com"})
    profilePic: string;

    @ApiProperty({example:"4646swwewd"})
    password : string

    @ApiProperty({example:"1"})
    loginType : string
  }
  