import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { ApiBody, ApiExtraModels, ApiResponse } from '@nestjs/swagger';


@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Get()
    findAll(): Book[] {
        return this.booksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Book {
        return this.booksService.findOne(Number(id));
    }

    @Post()
    @ApiResponse({ status: 201, description: 'User created.', type: Book})
    @ApiExtraModels(Book)
    @ApiBody({description: 'The user to create', type: Book,})
    create(@Body() book: Omit<Book, 'id'>): Book {
        return this.booksService.create(book);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() bookData: Partial<Book>): Book {
        return this.booksService.update(Number(id), bookData);
    }

    @Delete(':id')
    delete(@Param('id') id: string): boolean {
        return this.booksService.delete(Number(id));
    }
}
