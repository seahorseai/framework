import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SignInUserStory } from './signin-user-story/signin.user-story';
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { SignInRequest } from './signin-user-story/signin-request';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
  templateUrl: './sign-in.component.html'
})
export class SignInComponent {
  protected form: FormGroup;
	existingUserMessage: string;
  // protected minlength: number = 8;

  constructor(
    private formBuilder: FormBuilder,
    private signInService: SignInUserStory,
		private router: Router
  ){
		this.existingUserMessage = '';
    this.form = this.formBuilder.group({
      userName: ['', Validators.required],
      userEmail: ['', [
          Validators.required,
          Validators.email
        ]
      ],
      organizationName: ['', Validators.required],
      userPassword: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50)
        ]
      ],
      userPasswordConfirm: ['', [
					Validators.required,
					this.confirmPasswordValidator
				]
			],
    }, { updateOn: 'submit' });
  }

	confirmPasswordValidator: ValidatorFn = (control: AbstractControl): null | ValidationErrors => {
		let userPassword = control.parent?.get('userPassword')?.value;
		let userPasswordConfirm = control.parent?.get('userPasswordConfirm')?.value;
		return userPassword === userPasswordConfirm ? null : {unconfirmed: true}
	};

  onSubmit(): void {
    if (this.form.valid) {
			const newUserData: SignInRequest = {
				userName: this.form.get('username')?.value,
				userEmail: this.form.get('email')?.value,
				organizationName: this.form.get('organizationName')?.value,
				userPassword: this.form.get('password')?.value,
			}

			this.signInService.signInUser(newUserData).subscribe((response) => {
				console.log(response.body?.message);
				this.router.navigateByUrl('login');
			})
    }
  }
}
