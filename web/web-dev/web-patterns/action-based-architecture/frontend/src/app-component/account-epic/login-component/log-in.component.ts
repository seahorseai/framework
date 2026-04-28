import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LogInRequest } from './login-user-story/login-request.dto';
import { LogInUserStory } from './login-user-story/login.user-story';

// import { usernameOrEmailValidator } from './username-or-email-validator';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    RouterLink,
    NgClass,
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
  templateUrl: './log-in.component.html'
})
export class LogInComponent {
  protected form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
		private logInService: LogInUserStory,
		private router: Router
  ){
    this.form = this.formBuilder.group({
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8), 
        Validators.maxLength(50)
      ]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
			const logInData: LogInRequest = {
				email: this.form.get("email")?.value,
				password: this.form.get("password")?.value,
			}

			this.logInService.logInUser(logInData).subscribe((response) => {
				console.log(response.body?.message);
				this.router.navigateByUrl('home');
			})
    }
  }
}
