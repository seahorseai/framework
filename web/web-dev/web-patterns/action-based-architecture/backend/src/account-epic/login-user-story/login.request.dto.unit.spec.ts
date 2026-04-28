import { validate } from 'class-validator';
import { LoginRequest } from './login.request.dto';


describe('LogInRequest', () => {
    it('should validate a valid login request', async () => {
        const loginRequest = new LoginRequest();
        loginRequest.email = 'example@example.com';
        loginRequest.password = 'password123';

        const errors = await validate(loginRequest);
        expect(errors).toHaveLength(0);
    });

    it('should validate an invalid email', async () => {
        const loginRequest = new LoginRequest();
        loginRequest.email = 'invalid-email';
        loginRequest.password = 'password123';

        const errors = await validate(loginRequest);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints).toEqual({ message: 'Should be a valid email' });
    });

    it('should validate an invalid password', async () => {
        const loginRequest = new LoginRequest();
        loginRequest.email = 'example@example.com';
        loginRequest.password = undefined;

        const errors = await validate(loginRequest);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints).toEqual({ message: 'Should be a valid password' });
    });
});