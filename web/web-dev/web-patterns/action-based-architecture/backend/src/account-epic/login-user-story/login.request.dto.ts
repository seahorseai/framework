import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";


export class LoginRequest {

    @IsEmail({}, {message: 'Should be a valid email'})
    @ApiProperty()
    email: string;

    @IsString({message: 'Should be a valid password'})
    @ApiProperty()
    password: string;
}