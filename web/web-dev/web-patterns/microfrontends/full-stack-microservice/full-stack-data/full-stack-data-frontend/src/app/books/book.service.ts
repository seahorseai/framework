import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book';


@Injectable({
    providedIn: 'root',
})
export class BookService {
    private apiUrl = 'http://localhost:3000/books';

    constructor(private http: HttpClient) {}

    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(this.apiUrl);
    }

    getBook(id: string): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/${id}`);
    }

    addBook(book: Omit<Book, '_id'>): Observable<Book> {
        return this.http.post<Book>(this.apiUrl, book);
    }

    updateBook(id: string, bookData: Partial<Book>): Observable<Book> {
        return this.http.put<Book>(`${this.apiUrl}/${id}`, bookData);
    }

    deleteBook(id: string) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
