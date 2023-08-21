import { ApiProperty } from "@nestjs/swagger";
import { Message } from "src/schemas/message.schema";

export class IDeleteMessage{
    @ApiProperty({example:true})
    isDeleted:boolean
    @ApiProperty({example:"Message Deleted."})
    message:string
    
}