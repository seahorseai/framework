import { validate } from 'class-validator';
import { SigninRequest } from './signin-request.dto';


describe('SigninRequest', () => {
    it('should validate successfully with valid data', async () => {
        const signInRequest = new SigninRequest();
        signInRequest.name = 'John Doe';
        signInRequest.email = 'johndoe@example.com';
        signInRequest.password = 'password123';
        const errors = await validate(signInRequest);
        expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid name', async () => {
        const signInRequest = new SigninRequest();
        signInRequest.name = '';
        signInRequest.email = 'johndoe@example.com';
        signInRequest.password = 'password123';

        const errors = await validate(signInRequest);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('name');
        expect(errors[0].constraints).toEqual({ isNotEmpty: 'Name should not be empty' });
    });

    it('should fail validation with invalid email', async () => {
        const signInRequest = new SigninRequest();
        signInRequest.name = 'John Doe';
        signInRequest.email = 'invalid-email';
        signInRequest.password = 'password123';
    

        const errors = await validate(signInRequest);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('email');
        expect(errors[0].constraints).toEqual({ isEmail: 'Should be a valid email' });
    });

    it('should fail validation with invalid password', async () => {
        const signInRequest = new SigninRequest();
        signInRequest.name = 'John Doe';
        signInRequest.email = 'johndoe@example.com';
        signInRequest.password = '';
       

        const errors = await validate(signInRequest);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('password');
        expect(errors[0].constraints).toEqual({ isNotEmpty: 'Password should not be empty' });
    });

    it('should fail validation with invalid organization name', async () => {
        const signInRequest = new SigninRequest();
        signInRequest.name = 'John Doe';
        signInRequest.email = 'johndoe@example.com';
        signInRequest.password = 'password123';
      

        const errors = await validate(signInRequest);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('organizationName');
        expect(errors[0].constraints).toEqual({ isNotEmpty: 'Organization name should not be empty' });
    });
});