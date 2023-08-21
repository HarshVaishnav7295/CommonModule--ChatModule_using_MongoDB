import { ApiProperty } from "@nestjs/swagger";
import { Message } from "src/schemas/message.schema";

export class IGetConversationWith{
    @ApiProperty({example:true})
    success:boolean
    @ApiProperty({example:[
        {
            "_id": "64d234bbeb491ebb2f4081e8",
            "data": "qqq",
            "isMedia": false,
            "isRead": true,
            "sender": {
                "_id": "648ad4316f1935878c0d2cc6",
                "name": "Harsh23",
                "email": "harshvaishnav@techtic.agency",
                "__v": 0,
                "loginType": 0,
                "isLogedIn": true,
                "socketId": "",
                "updatedAt": "2023-08-21T07:12:28.044Z",
                "isDeleted": false,
                "profilePic": "sqwsqwws"
            },
            "receiver": {
                "_id": "648ad4316f1935878c0d2cc6",
                "name": "Harsh23",
                "email": "harshvaishnav@techtic.agency",
                "__v": 0,
                "loginType": 0,
                "isLogedIn": true,
                "socketId": "",
                "updatedAt": "2023-08-21T07:12:28.044Z",
                "isDeleted": false,
                "profilePic": "sqwsqwws"
            },
            "createdAt": "2023-08-08T12:27:39.069Z",
            "updatedAt": "2023-08-09T06:47:40.293Z",
            "__v": 0
        }
    ]})
    data:Message[]
}