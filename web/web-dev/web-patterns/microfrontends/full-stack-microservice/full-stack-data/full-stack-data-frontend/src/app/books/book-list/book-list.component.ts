import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from '../book';


@Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit {
    books: Book[] = [];
    newBook: Omit<Book, '_id'> = { title: '', author: '' };

    constructor(private bookService: BookService) {}

    ngOnInit(): void {
        this.loadBooks();
    }

    loadBooks(): void {
        this.bookService.getBooks().subscribe((books) => (this.books = books));
    }

    addBook(): void {
        this.bookService.addBook(this.newBook).subscribe(() => {
            this.loadBooks();
            this.newBook = { title: '', author: '' };
        });
    }

    deleteBook(id: string): void {
      this.bookService.deleteBook(id).subscribe(() => this.loadBooks());
    }
}
