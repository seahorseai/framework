import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
		TodoModule,
    MongooseModule.forRoot('mongodb://root:1234@localhost:27017/',{
			dbName: 'todos'
		})
	],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}