import { IsString,IsEmail, IsBoolean } from "class-validator"
import { ObjectId } from "mongodb"

export class CreateMessage{

    @IsString()
    data : string

    @IsString()
    sender : ObjectId

    @IsString()
    receiver : ObjectId

}