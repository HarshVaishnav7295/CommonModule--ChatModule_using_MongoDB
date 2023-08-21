import { ApiProperty } from "@nestjs/swagger"
import { IsString,IsEmail } from "class-validator"

export class LoginDto{

    @ApiProperty({example:"harsh@gmail.com"})
    @IsEmail()
    email:string
    
    @ApiProperty({example:"6598swsw45ew"})
    @IsString()
    password:string
}