import { HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './todo.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateTodoRequest } from './dto/create-todo-request.dto';
import { UpdateTodoRequest } from './dto/update-todo-request.dto';
import { DeleteTodoResponse } from './dto/delete-todo-response.dto';
import { CreateTodoResponse } from './dto/create-todo-response.dto';
import { GetAllTodosResponse } from './dto/get-all-todos-response.dto';
import { GetTodoByIdResponse } from './dto/get-todo-by-id-response.dto';
import { UpdateTodoResponse } from './dto/update-todo-response.dto';

@Injectable()
export class TodoService {

	constructor(
    @InjectModel(Todo.name) private todoModel: Model<Todo>,
  ) {}

	@HttpCode(201)
  async create(createTodoRequest: CreateTodoRequest): Promise<CreateTodoResponse> {
		const newTodo = new this.todoModel(createTodoRequest);
		await newTodo.save();
		return new CreateTodoResponse(newTodo._id.toString(), newTodo.name);
  }

  async findAll(): Promise<Todo[]> {
		const foundTodos = await this.todoModel.find().exec();
		return foundTodos;
  }

  async findOne(id: string): Promise<GetTodoByIdResponse> {
		const foundTodo = await this.todoModel.findById(id).exec();
		if (!foundTodo) throw new NotFoundException(`Todo not found`);
		return new GetTodoByIdResponse(foundTodo._id.toString(), foundTodo.name);
  }

  async update(id: string, todoUpdateData: UpdateTodoRequest): Promise<UpdateTodoResponse> {
		console.log(id);
		console.log(todoUpdateData.name);
		const todoId = new mongoose.mongo.BSON.ObjectId(id);
		const updatedTodo = await this.todoModel.findByIdAndUpdate(todoId, todoUpdateData, {new: true}).exec();
		console.log(updatedTodo);
		if(!updatedTodo) throw new NotFoundException(`Todo to update not found`);
		return new UpdateTodoResponse(updatedTodo._id.toString(), updatedTodo.name);
  }

  async delete(id: string): Promise<DeleteTodoResponse> {
    const deletedTask = await this.todoModel.findByIdAndDelete(id).exec();
		if (!deletedTask) throw new NotFoundException(`Todo to delete not found`);
		return new DeleteTodoResponse();
  }
}