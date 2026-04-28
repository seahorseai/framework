import { Injectable } from '@nestjs/common';
import { Book } from './book.entity';

@Injectable()
export class BooksService {
    private books: Book[] = [];
    private idCounter = 1;

    findAll(): Book[] {
        return this.books;
    }

    findOne(id: number): Book {
        return this.books.find((book) => book.id === id);
    }

    create(book: Omit<Book, 'id'>): Book {
        const newBook = { ...book, id: this.idCounter++ };
        this.books.push(newBook);
        return newBook;
    }

    update(id: number, bookData: Partial<Book>): Book {
        const book = this.findOne(id);
        if (!book) return null;

        Object.assign(book, bookData);
        return book;
    }

    delete(id: number): boolean {
        const index = this.books.findIndex((book) => book.id === id);
        if (index === -1) return false;

        this.books.splice(index, 1);
        return true;
    }
}
