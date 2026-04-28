import { Component } from '@angular/core';
import { Todo } from './todo.interface';
import { TodoService } from './todo.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent {

	todoList: Observable<Todo[]> = of([]);
	todoToUpdate: Todo | false = false;

	constructor(private todoService: TodoService) {

	}

	ngOnInit() {
		this.getEveryTodo();
	}
 
	getEveryTodo(): void {
		this.todoList = this.todoService.getEveryTodo();
	}
	
	createTodo(todoName: string): void {
		this.todoService.createNewTodo(todoName).subscribe(() => this.todoList = this.todoService.getEveryTodo());
	}

	updateTodo(id: string, todoName: string): void {
		this.todoService.updateTodo(id, todoName).subscribe(() => this.todoList = this.todoService.getEveryTodo());
		this.todoToUpdate = false;
	}
	
	deleteTodo(todoId: string): void {
		this.todoService.deleteTodo(todoId).subscribe(() => this.todoList = this.todoService.getEveryTodo());
		this.todoToUpdate = false;
	}
}