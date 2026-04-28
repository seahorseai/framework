import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { isRegExp } from "util/types";

export class SigninRequest {

    @IsString({ message: 'Should be a string' })
    @IsNotEmpty({ message: 'Name should not be empty' })
    @ApiProperty()
    name: string;

    @IsEmail({}, { message: 'Should be a valid email' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    @ApiProperty()
    email: string;

    //TODO Regex
    @IsString({ message: 'Should be a string' })
    @IsNotEmpty({ message: 'Password should not be empty' })
    @ApiProperty()
    password: string;


}
