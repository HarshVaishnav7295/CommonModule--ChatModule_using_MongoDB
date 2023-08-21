import {Schema,Prop,SchemaFactory} from '@nestjs/mongoose'
import { ObjectId } from 'mongodb'
import { now } from 'mongoose'

@Schema({timestamps: true})
export class Message{
    @Prop({type:String,required:true})
    data : string

    @Prop({type:Boolean,default:false})
    isMedia : boolean

    
    @Prop({type:String})
    mediaUrl : string

    @Prop({type : Boolean,default:false})
    isRead : boolean

    @Prop({type : ObjectId,required:true})
    sender : ObjectId

    @Prop({type : ObjectId,required:true})
    receiver : ObjectId

    @Prop({type:Array})
    deletedBy : Array<string>
}

export const MessageSchema = SchemaFactory.createForClass(Message)