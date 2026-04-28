import { ApiProperty } from "@nestjs/swagger";


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Book>;

export type AccountModelHydratedDocument = HydratedDocument<Book>;

@Schema()
export class Book {
    @ApiProperty()
    @Prop()
    title: string;
    @ApiProperty()
    @Prop()
    author: string;
}
export const BookSchema = SchemaFactory.createForClass(Book);