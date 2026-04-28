import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BookListComponent } from './book-list/book-list.component';

@NgModule({
    declarations: [
        BookListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
    ],
    exports: [
        BookListComponent,
    ],
})
export class BooksModule {}
