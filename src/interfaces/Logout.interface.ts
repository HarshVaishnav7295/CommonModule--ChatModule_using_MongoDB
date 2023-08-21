import { ApiProperty } from "@nestjs/swagger"
import { UserDto } from "src/dtos/user.dtos/User.dto"

export class ILogout{
    @ApiProperty({example:true})
    success:boolean
    @ApiProperty({example:"Logout successful."})
    message:string
    
}