import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Todo {

    @ApiProperty()
		@Prop()
    name: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);