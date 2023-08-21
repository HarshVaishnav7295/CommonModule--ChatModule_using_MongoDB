import { ApiProperty } from "@nestjs/swagger"
import { IsString,IsEmail } from "class-validator"

export class RegisterUserDto{
    
    @ApiProperty({example:"harsh"})
    @IsString()
    name : string

    @ApiProperty({example:"harsh@gmail.com"})
    @IsEmail()
    email:string

    @ApiProperty({example:"6598swsw45ew"})
    @IsString()
    password:string
}