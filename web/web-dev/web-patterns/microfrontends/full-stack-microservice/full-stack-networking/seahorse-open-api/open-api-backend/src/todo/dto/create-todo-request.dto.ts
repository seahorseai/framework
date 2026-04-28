import { ApiProperty } from "@nestjs/swagger";

export class CreateTodoRequest {

	@ApiProperty()
	name: string;
}