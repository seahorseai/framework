import { TestBed } from '@angular/core/testing';

import { LogInUserStory } from './login.user-story';
import { LogInRequest } from './login-request.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { LogInResponse } from './login-response';

describe('LogInUserStory', () => {
  let logInService: LogInUserStory;
	let httpTestController: HttpTestingController;
	let httpError: HttpErrorResponse;
	let mockRequest: TestRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
			imports: [HttpClientTestingModule]
		});
    logInService = TestBed.inject(LogInUserStory);
		httpTestController = TestBed.inject(HttpTestingController);
  });

	afterEach(() => {
		httpTestController.verify();
	});

  it('should be created', () => {
    expect(logInService).toBeTruthy();
  });

	it('should log in an existing user with email', () => {
		let mockUserData: LogInRequest = {
			email: "paul7777@hotmail.com",
			password: "12345678"
		};

		let mockLogInResponse: LogInResponse = {
			message: 'User logged in successfully!!'
		};

		let responseMessage: string = '';

		logInService.logInUser(mockUserData).subscribe((response) => {
			responseMessage = response.body?.message as string;
		});

		mockRequest = httpTestController.expectOne(`${logInService.apiURL}/login`);
		expect(mockRequest.request.method).toEqual("POST");
		mockRequest.flush(mockLogInResponse);
		expect(responseMessage).toEqual(mockLogInResponse.message);
	});

	it('should be able to handle errors when trying to log in an existing user', () => {
		let mockUserData: LogInRequest = {
			email: "bademail",
			password: "12345678"
		};

		logInService.logInUser(mockUserData).subscribe({
			next: () => fail("Error thrown"),
			error: (err: HttpErrorResponse) => httpError = err
		});

		mockRequest = httpTestController.expectOne(`${logInService.apiURL}/login`);
		mockRequest.flush('Server error', {
			status: 400,
			statusText: 'Bad Request'
		} as HttpErrorResponse);

		if(!httpError)
			throw new Error("Errors can't be handled correctly");

		expect(httpError.status).toEqual(400);
		expect(httpError.statusText).toEqual('Bad Request');
	});
});
