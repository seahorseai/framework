export class CreateUserResponse {
	message: string;
	user: {
		name: string;
		email: string;
		password: string;
		role: 'user' | 'admin';
	}
}