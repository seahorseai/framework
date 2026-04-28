import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsString, Length, } from 'class-validator';
import mongoose, { HydratedDocument, } from 'mongoose';


export type AccountModelHydrateDocument = HydratedDocument<AccountModel>;

@Schema()
export class AccountModel {

    @IsString({ message: 'Should be a valid username' })
    @Length(3, 18)
    @Prop()
    name: string;

    @IsEmail({}, { message: 'Should be a valid email' })
    @Prop({ unique: true, length: 100,  })
    email: string;

    @IsString({ message: 'Should be a valid password' })
    @Length(6, 60)
    @Prop()
    password: string;




}

export const UserSchema = SchemaFactory.createForClass(AccountModel);

