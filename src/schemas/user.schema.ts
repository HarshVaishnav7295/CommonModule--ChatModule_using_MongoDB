import {Schema,Prop,SchemaFactory} from '@nestjs/mongoose'

@Schema({timestamps: true})
export class User{
    @Prop({type:String,required:true})
    name : string

    @Prop({type:String,required:true,unique:true})
    email : string

    @Prop({type:String})
    password : string

    @Prop({type:String})
    profilePic : string

    @Prop({type:String})
    fb_id : string

    @Prop({type:String})
    google_id : string

    @Prop({type:String})
    apple_id : string
    
    @Prop({type:Number,enum:[0,1],default:0}) // 0-> normal, 1-> social
    loginType : number

    @Prop({type:Boolean,default:false})
    isLogedIn : boolean

    @Prop({type:String})
    socketId : string

    @Prop({type:Boolean,default:false})
    isDeleted : boolean
}

export const UserSchema = SchemaFactory.createForClass(User)