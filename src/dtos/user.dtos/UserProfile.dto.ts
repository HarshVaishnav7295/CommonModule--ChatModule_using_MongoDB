import { ApiProperty } from "@nestjs/swagger";

export class UserProfileDto {
  
  @ApiProperty({example:"dede5454e5r4ed"})
  _id : string;
  @ApiProperty({example:"harsh"})
  name: string;

  @ApiProperty({example:"harsh@gmail.com"})
  email: string;

  @ApiProperty({example:"www.google.com"})
  profilePic?: string;

}
