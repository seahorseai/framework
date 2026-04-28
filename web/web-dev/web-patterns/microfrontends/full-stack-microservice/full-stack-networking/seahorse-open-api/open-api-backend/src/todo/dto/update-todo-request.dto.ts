import { ApiProperty } from "@nestjs/swagger";

export class UpdateTodoRequest {

	@ApiProperty()
	name: string;
}