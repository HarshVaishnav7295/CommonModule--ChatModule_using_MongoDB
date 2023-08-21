import { ApiProperty } from "@nestjs/swagger";
import { Message } from "src/schemas/message.schema";

export class IClearMyChat{
    @ApiProperty({example:true})
    isCleared:boolean
    
}