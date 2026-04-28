import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
// import { MatErrorHarness } from '@angular/material/form-field/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { provideRouter } from '@angular/router';


import { HttpClientTestingModule } from '@angular/common/http/testing';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { LogInComponent } from './log-in.component';

import { routes } from '../../app.routes';
import { LogInUserStory } from './login-user-story/login.user-story';

let loader: HarnessLoader;
let fixture: ComponentFixture<LogInComponent>;
let emailFormField: MatFormFieldHarness;
let passwordFormField: MatFormFieldHarness;
let submitButton: MatButtonHarness;

describe('LogInComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule(
			{
				imports: [
					LogInComponent,
					HttpClientTestingModule
				],
				providers: [
					LogInUserStory,
					provideRouter(routes),
					provideAnimationsAsync(),
				]
			})
			.compileComponents();

		fixture = TestBed.createComponent(LogInComponent);
		loader = TestbedHarnessEnvironment.loader(fixture);

		let formFields = await loader.getAllHarnesses(MatFormFieldHarness);

		emailFormField = formFields[0];
		passwordFormField = formFields[1];

		submitButton = await loader.getHarness(MatButtonHarness.with({ selector: 'button[mat-raised-button]' }));
	});

	it('should create form', async () => {
		expect(await emailFormField.getControl()).toBeTruthy();
		expect(await passwordFormField.getControl()).toBeTruthy();
		expect(submitButton).toBeTruthy();
	});

  //-> Sync Validation

	it('email field should display error message when empty', async () => {
		await submitButton.click();
		let error = (await emailFormField.getErrors())?.[0];
		expect(await error.getText()).toBe('email is required');
	});

	it('email field should display error message when invalid', async () => { 
		let emailInput = await emailFormField.getControl(MatInputHarness);
    await emailInput?.setValue('1234');
    await emailInput?.blur();
		let error = (await emailFormField.getErrors())?.[0];
		expect(await error.getText()).toBe('email is invalid');
	});

	it('email field shouldn\'t display error message when valid', async () => {
    let emailInput = await emailFormField.getControl(MatInputHarness);
    await emailInput?.setValue('pepe@gmail.com');
    await emailInput?.blur();
		let error = (await emailFormField.getErrors())?.[0];
		expect(error).toBeFalsy();
  })

	it('password field should display error message when empty', async () => {
    await submitButton.click();
		let error = (await passwordFormField.getErrors())?.[0];
		expect(await error.getText()).toBe('password is required');
  })

	it('password field should display error message when value length is lower than minimum one', async () => {
    let passwordInput = await passwordFormField.getControl(MatInputHarness);
    await passwordInput?.setValue('1');
    await passwordInput?.blur();
		let error = (await passwordFormField.getErrors())?.[0];
		expect(await error.getText()).toBe('password must be between 8 and 50 characters');
  })

	it('password field should display error message when value length is greater than maximum one', async () => {
    let passwordInput = await passwordFormField.getControl(MatInputHarness);
    await passwordInput?.setValue('123456789123456789123456789123456789123456789123456');
    await passwordInput?.blur();
		let error = (await passwordFormField.getErrors())?.[0];
		expect(await error.getText()).toBe('password must be between 8 and 50 characters');
  })

  it('password field shouldn\'t display error message when valid', async () => {
    let passwordInput = await passwordFormField.getControl(MatInputHarness);
    await passwordInput?.setValue('12345678');
    await passwordInput?.blur();
		let error = (await passwordFormField.getErrors())?.[0];
		expect(error).toBeFalsy();
  })

  //-> Async validation
});