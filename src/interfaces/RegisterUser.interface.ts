import { ApiProperty } from "@nestjs/swagger"
import { UserDto } from "src/dtos/user.dtos/User.dto"

export class IRegisterUser{
    @ApiProperty({example:true})
    success:boolean
    @ApiProperty({example:"Error."})
    error:string
    @ApiProperty({example:{
        _id:"wdwdw5d5w4545",
        name:"Harsh",
        email:"harsh@gmail.com",
        profilePic:"www.google.com"
    }})
    user : UserDto
}
