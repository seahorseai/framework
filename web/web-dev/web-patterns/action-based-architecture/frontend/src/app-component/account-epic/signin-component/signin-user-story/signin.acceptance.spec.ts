import { DefineStepFunction, defineFeature, loadFeature } from 'jest-cucumber';
import { SignInComponent } from '../sign-in.component';
import { SignInRequest } from './signin-request';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HttpClientModule } from '@angular/common/http';
import { SignInUserStory } from './signin.user-story';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from '../../../app.routes';
import { DefineScenarioFunctionWithAliases } from 'jest-cucumber/dist/src/feature-definition-creation';
import { AppComponent } from '../../../app.component';
import { RouterTestingHarness } from '@angular/router/testing';
import { HomeComponent } from '../../../project-epic/home-component/home.component';

const userFillsGoodSignInFormFeature = loadFeature('./src/app-component/account-epic/signin-component/signin-user-story/signin.feature');

defineFeature(userFillsGoodSignInFormFeature, (defineScenarioFunctionWithAliases: DefineScenarioFunctionWithAliases) => {

	let signInRequest: SignInRequest;
	let signInComponentFixture: ComponentFixture<SignInComponent>;
	let signInComponent: SignInComponent;
	let signInHarnessLoader: HarnessLoader;
	let nameMatFormFieldHarness: MatFormFieldHarness;
	let emailMatFormFieldHarness: MatFormFieldHarness;
	let organizationNameMatFormFieldHarness: MatFormFieldHarness;
	let passwordMatFormFieldHarness: MatFormFieldHarness;
	let confirmPasswordMatFormFieldHarness: MatFormFieldHarness;
	let nameMatInputHarness: MatInputHarness;
	let emailMatInputHarness: MatInputHarness;
	let organizationNameMatInputHarness: MatInputHarness;
	let passwordMatInputHarness: MatInputHarness;
	let confirmPasswordMatInputHarness: MatInputHarness;
	let signInMatButtonHarness: MatButtonHarness;
	let appComponentFixture: ComponentFixture<AppComponent>;
	let appComponent: AppComponent;
	let routerTestingHarness: RouterTestingHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule(
			{
				imports: [
					SignInComponent,
					HttpClientModule
				],
				providers: [
					SignInUserStory,
					provideRouter(routes),
					provideAnimationsAsync(),

				]
			})
			.compileComponents();

		appComponentFixture = TestBed.createComponent(AppComponent);
		appComponent = appComponentFixture.componentInstance;
		//* appComponentFixture.detectChanges();
		routerTestingHarness = await RouterTestingHarness.create();

		signInRequest = {
			userName: 'Pepe',
			userEmail: 'pepe@gmail.com',
			userPassword: '12345678',
			organizationName: 'Pepe\'s Organization'
		};
		signInComponentFixture = TestBed.createComponent(SignInComponent);
		signInComponent = signInComponentFixture.componentInstance;
		signInHarnessLoader = TestbedHarnessEnvironment.loader(signInComponentFixture);

		let formFields = await signInHarnessLoader.getAllHarnesses(MatFormFieldHarness);

		nameMatFormFieldHarness = formFields[0];
		emailMatFormFieldHarness = formFields[1];
		organizationNameMatFormFieldHarness = formFields[2];
		passwordMatFormFieldHarness = formFields[3];
		confirmPasswordMatFormFieldHarness= formFields[4];

		organizationNameMatInputHarness = await organizationNameMatFormFieldHarness.getControl() as MatInputHarness;
		emailMatInputHarness = await emailMatFormFieldHarness.getControl() as MatInputHarness;
		nameMatInputHarness = await nameMatFormFieldHarness.getControl() as MatInputHarness;
		passwordMatInputHarness = await passwordMatFormFieldHarness.getControl() as MatInputHarness;
		confirmPasswordMatInputHarness = await confirmPasswordMatFormFieldHarness.getControl() as MatInputHarness;
	 });

	 defineScenarioFunctionWithAliases('The user does not exist in database', ({ given, when, then, and }) => {
        given('a user on the SigninFormComponent', () => {

        });

        when(/^The user enters "(.*)", "(.*)", "(.*)", "(.*)"$/, (organizationName, email, name, password, confirmPassword) => {
			organizationNameMatInputHarness.setValue(organizationName);
			emailMatInputHarness.setValue(email);
			nameMatInputHarness.setValue(name);
			passwordMatInputHarness.setValue(password);
			confirmPasswordMatInputHarness.setValue(confirmPassword);
        });

        and('the user clicks the signin button', () => {
			signInMatButtonHarness.click();
        });

        then('the frontend sends the SigninRequest DTO to the backend', () => {

        });

        then(/^the backend check the "(.*)" does not exist in database$/, (arg0) => {

        });

        then('UserAccount is created in the database', () => {

        });

        then(/^the backend response with this code status: "(.*)"$/, (arg0) => {

        });

        then('the frontend shows the LoginFormComponent', () => {

        });
    });

	defineScenarioFunctionWithAliases('The user exists in database', ({ given, when, then, and }) => {
        given('a user on the SigninFormComponent', () => {

        });

        when(/^The user enters "(.*)", "(.*)", "(.*)", "(.*)"$/, (organizationName, email, name, password, confirmPassword) => {
			organizationNameMatInputHarness.setValue(organizationName);
			emailMatInputHarness.setValue(email);
			nameMatInputHarness.setValue(name);
			passwordMatInputHarness.setValue(password);
			confirmPasswordMatInputHarness.setValue(confirmPassword);

        });

		and('the user clicks the signin button', () => {
			signInMatButtonHarness.click();
        });

        then('the front-end layer sends the UserRequest DTO to the back-end layer', () => {

        });

        then(/^the back-end layer check that "(.*)" exist in database$/, (arg0) => {

        });

		then(/^the backend layer response with this status code: "(.*)" and this DTO: "(.*)"$/, (arg0, arg1) => {

		});

        then(/^the frontend shows this message: "(.*)"$/, (arg0) => {

        });
    });

	defineScenarioFunctionWithAliases('User fills wrong the signin form', ({ given, when, then, and }) => {
        given('a user on the SigninFormComponent', () => {

        });

		when(/^The user enters "(.*)", "(.*)", "(.*)", "(.*)"$/, (organizationName, email, name, password, confirmPassword) => {
			organizationNameMatInputHarness.setValue(organizationName);
			emailMatInputHarness.setValue(email);
			nameMatInputHarness.setValue(name);
			passwordMatInputHarness.setValue(password);
			confirmPasswordMatInputHarness.setValue(confirmPassword);
        });

		and('the user clicks the signin button', () => {
			signInMatButtonHarness.click();
        });

        then('the frontend shows a message for each incorrect field', () => {

        });
    });
});