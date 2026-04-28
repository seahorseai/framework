import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({



  imports: [
      MongooseModule.forRoot('mongodb://root:1234@localhost:27017/',{
      dbName: 'seahorse'
    }),
    BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
