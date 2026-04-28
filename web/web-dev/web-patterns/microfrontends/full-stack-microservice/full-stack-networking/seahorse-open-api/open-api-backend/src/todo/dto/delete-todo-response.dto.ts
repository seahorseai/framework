import { ApiProperty } from "@nestjs/swagger";

export class DeleteTodoResponse {
	@ApiProperty()
	deleted: boolean = true;
}