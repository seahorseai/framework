import { TestBed } from '@angular/core/testing';

import { SignInUserStory } from './signin.user-story';
import { SignInRequest } from './signin-request';
import { SignInResponse } from './signin-response';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';


describe('SignInUserStory', () => {
  let signInService: SignInUserStory;
	let httpTestController: HttpTestingController;
	let mockSignInRequest: TestRequest;
	let httpError: HttpErrorResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({
			imports: [HttpClientTestingModule]
		});
    signInService = TestBed.inject(SignInUserStory);
		httpTestController = TestBed.inject(HttpTestingController);
  });

	afterEach(() => {
		httpTestController.verify();
	});

  test('should be created', () => {
    expect(signInService).toBeTruthy();
  });

	test('should send the user and organization to the backend (The user fills good the form to sign in or The user fills good the form but user or organization exist in database)', () => {
		let userAndOrganizationData: SignInRequest = {
			userName: "paul7777",
			userEmail: "paul7777@hotmail.com",
			organizationName: "Paul's Organization",
			userPassword: "1234"
		};

		let successfulSignInMessage: string = '';

		signInService.signInUser(userAndOrganizationData).subscribe(
			signInResponse => successfulSignInMessage = signInResponse.body?.message as string
		);

		mockSignInRequest = httpTestController.expectOne(`${signInService.apiURL}/signin`);
		expect(mockSignInRequest.request.method).toEqual("POST");

		let mockSuccessMessage: SignInResponse = { message: 'User registered successfully!!' };
		mockSignInRequest.flush(mockSuccessMessage);
		expect(successfulSignInMessage).toEqual(mockSuccessMessage.message);
	});

	// it('should be able to handle errors when trying to register a new user', () => {
	// 	let mockUserData: SignInRequest = {
	// 		username: "paul7777",
	// 		email: "bademail",
	// 		password: "1234",
	// 		organizationName: "Paul's Organization"
	// 	};

	// 	signInService.signInUser(mockUserData).subscribe({
	// 		next: () => fail("Error thrown"),
	// 		error: (err: HttpErrorResponse) => httpError = err
	// 	});

	// 	mockRequest = httpTestController.expectOne(`${signInService.apiURL}/signin`);
	// 	mockRequest.flush('Server error', {
	// 		status: 400,
	// 		statusText: 'Bad Request'
	// 	} as HttpErrorResponse);

	// 	if(!httpError)
	// 		throw new Error("Errors can't be handled correctly");

	// 	expect(httpError.status).toEqual(400);
	// 	expect(httpError.statusText).toEqual('Bad Request');
	// });
});
