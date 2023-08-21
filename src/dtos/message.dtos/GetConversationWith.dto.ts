import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class GetConversationWithDTO{
    @ApiProperty({example:"ded5e5d454d"})
    @IsString()
    id:string
}