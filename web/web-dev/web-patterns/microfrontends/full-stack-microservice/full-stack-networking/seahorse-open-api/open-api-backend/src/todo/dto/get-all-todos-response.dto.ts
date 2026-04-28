import { ApiProperty } from "@nestjs/swagger";
import { Todo } from "../todo.schema";

export class GetAllTodosResponse {
	@ApiProperty()
	todos: Todo[];

	constructor(todos: Todo[]) {
		this.todos = todos;
	}
}