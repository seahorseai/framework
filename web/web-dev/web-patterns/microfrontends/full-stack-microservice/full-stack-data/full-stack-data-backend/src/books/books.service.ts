import { Injectable, NotFoundException } from '@nestjs/common';

import { Book } from './book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BooksService {
    private books: Book[] = [];
    

    constructor(
        @InjectModel(Book.name) private bookModel: Model<Book>,
      ) {}


    create(book: Book): Promise<Book> {
        const newBook = { ...book };
        const createdBook = new this.bookModel(newBook);
        return createdBook.save();
    }

    findAll(): Promise<Book[]>{
        //return this.books;
        return this.bookModel.find().exec();
    }



    async findOne(id: string): Promise<Book> {
        const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
    }

    async update(id: string, bookData: Partial<Book>): Promise<Book> {
        const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, bookData, { new: true })
      .exec();
    if (!updatedBook) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedBook;
    }

    async delete(id: string): Promise<boolean> {
             const deletedUser = await this.bookModel.findByIdAndDelete(id).exec();
            if (!deletedUser) {
            throw new NotFoundException(`User with id ${id} not found`);
            }
        return true;
    }
}
