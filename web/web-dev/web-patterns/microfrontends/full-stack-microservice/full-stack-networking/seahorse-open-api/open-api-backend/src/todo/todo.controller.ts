import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTodoRequest } from './dto/create-todo-request.dto';
import { UpdateTodoRequest } from './dto/update-todo-request.dto';
import { CreateTodoResponse } from './dto/create-todo-response.dto';
import { GetAllTodosResponse } from './dto/get-all-todos-response.dto';
import { UpdateTodoResponse } from './dto/update-todo-response.dto';
import { DeleteTodoResponse } from './dto/delete-todo-response.dto';
import { GetTodoByIdResponse } from './dto/get-todo-by-id-response.dto';
import { Todo } from './todo.schema';

@Controller('todos')
@ApiTags('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
	@ApiBody({ type: CreateTodoRequest, description: 'The necessary data to create a new todo' })
	@ApiResponse({ status: 201, type: CreateTodoResponse, description: 'Todo successfully created' })
  create(@Body() newBook: CreateTodoRequest): Promise<CreateTodoResponse> {
    return this.todoService.create(newBook);
  }

  @Get()
	@ApiResponse({ status: 200, type: GetAllTodosResponse, isArray: true, description: 'List with every todo' })
  findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
	@ApiResponse({ status: 200, type: GetTodoByIdResponse, description: 'Get todo by ID' })
	@ApiResponse({ status: 404, description: 'Todo not found' })
  findOne(@Param('id') id: string): Promise<GetTodoByIdResponse> {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
	@ApiBody({ type: UpdateTodoRequest, description: 'The necessary data to update a todo' })
	@ApiResponse({ status: 200, type: UpdateTodoResponse, description: 'Todo successfully updated' })
	@ApiResponse({ status: 404, description: 'Todo to update not found' })
  update(@Param('id') id: string, @Body() updateTodoData: UpdateTodoRequest): Promise<UpdateTodoResponse> {
    return this.todoService.update(id, updateTodoData);
  }

  @Delete(':id')
	@ApiResponse({ status: 200, type: DeleteTodoResponse, description: 'Todo successfully deleted' })
	@ApiResponse({ status: 404, description: 'Todo to delete not found' })	
  remove(@Param('id') id: string): Promise<DeleteTodoResponse> {
    return this.todoService.delete(id);
  }
}
