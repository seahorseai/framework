import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.schema';
import { ApiBody, ApiExtraModels, ApiResponse } from '@nestjs/swagger';


@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}



    @Post()
    @ApiResponse({ status: 201, description: 'User created.', type: Book})
    @ApiExtraModels(Book)
    @ApiBody({description: 'The user to create', type: Book,})
    async create(@Body() book: Book): Promise<Book> {
        return this.booksService.create(book);
    }

    @Get()
    findAll(): Promise<Book[]> {
        return this.booksService.findAll();
    }



   

    @Delete(':id')
    delete(@Param('id') id: string): Promise<boolean> {
        return this.booksService.delete(id);
    }



    @Get(':id')
    findOne(@Param('id') id: string): Promise<Book> {
        return this.booksService.findOne(id);
    }

    

    @Put(':id')
    update(@Param('id') id: string, @Body() bookData: Partial<Book>): Promise<Book> {
        return this.booksService.update(id, bookData);
    }

  
}
