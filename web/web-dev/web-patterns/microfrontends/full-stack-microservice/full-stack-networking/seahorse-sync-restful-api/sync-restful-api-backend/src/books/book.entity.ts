import { ApiProperty } from "@nestjs/swagger";

export class Book {
    @ApiProperty()
    id: number;
    @ApiProperty()
    title: string;
    @ApiProperty()
    author: string;
}
