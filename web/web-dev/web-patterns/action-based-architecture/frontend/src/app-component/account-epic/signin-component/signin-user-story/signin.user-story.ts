import { Injectable } from '@angular/core';
import { SignInRequest } from './signin-request';
import { SignInResponse } from './signin-response';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignInUserStory {

  readonly apiURL: string = 'http://localhost:3001/api/v1/accounts';

  constructor(private httpClient: HttpClient) { }

	signInUser(userData: SignInRequest): Observable<HttpResponse<SignInResponse>> {
    return this.httpClient.post<SignInResponse>(
      `${this.apiURL}/signin`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        observe: 'response' as const,
      }
    );
  }
}
