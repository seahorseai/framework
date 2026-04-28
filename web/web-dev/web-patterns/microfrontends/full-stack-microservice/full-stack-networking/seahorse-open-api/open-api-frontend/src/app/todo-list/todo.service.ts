import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todo.interface';
import { CreateTodoRequest } from './dto/create-todo-request.dto';
import { UpdateTodoRequest } from './dto/update-todo-request.dto';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

	readonly apiUrl = "http://localhost:3000/todos"

  constructor(private httpClient: HttpClient) { 

	}

	createNewTodo(taskName: string): Observable<Todo> {
		const createTodoRequest: CreateTodoRequest = {name: taskName};
		return this.httpClient.post<Todo>(this.apiUrl, createTodoRequest);
	}

	getEveryTodo(): Observable<Todo[]> {
		return this.httpClient.get<Todo[]>(this.apiUrl);
	}

	getTodoById(id: string): Observable<Todo> {
		return this.httpClient.get<Todo>(`${this.apiUrl}/${id}`);
	}

	updateTodo(id: string, taskName: string): Observable<Todo> {
		const updateTodoRequest: UpdateTodoRequest = {name: taskName};
		return this.httpClient.patch<Todo>(`${this.apiUrl}/${id}`, updateTodoRequest);
	}

	deleteTodo(id: string): Observable<boolean> {
		return this.httpClient.delete<boolean>(`${this.apiUrl}/${id}`);
	}
}