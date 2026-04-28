export class CreateUserRequest {
	name: string;
	email: string;
	password: string;
	role: 'user' | 'admin';
	
}