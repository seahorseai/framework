import { TestingModule, Test } from '@nestjs/testing';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { DefineScenarioFunctionWithAliases } from 'jest-cucumber/dist/src/feature-definition-creation';
import { AppModule } from '../../app.module';
import * as request from 'supertest';
import { SignInRequest } from './signin-request.dto';
import { ConflictException } from '@nestjs/common';

const signInFeature = loadFeature("src/user/do-signin-use-case/user-fills-good-signin-form.feature");

defineFeature(signInFeature, (test: DefineScenarioFunctionWithAliases) => {
    let app;
    let response;
    let signInRequest: SignInRequest = new SignInRequest();
    beforeEach(async () => {
        // const module: TestingModule = await Test.createTestingModule({
        //     imports: [
        //         MongooseModule.forRoot('mongodb://root:1234@localhost:27017/', {
        //             dbName: 'seahorse'
        //         }),
        //         UsersModule,
        //     ],
        //     controllers: [],
        //     providers: [],
        // }).compile();
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(() => {
        signInRequest = new SignInRequest();
        app.close();
    })

    test('The user and organization does not exists in database', ({ given, when, then }) => {
        given('a user is not registered', () => {

        });

        when(/^The user enters "(.*)", "(.*)", "(.*)", "(.*)", "(.*)"$/, (arg0, arg1, arg2, arg3, arg4) => {

        });

        then('the frontend sends the user and organization to the backend', () => {

        });

        then('the backend check the user and organization does not exist in database', () => {

        });

        then('organization and user are created in the database', () => {

        });

        then(/^the backend response with this code status: "(.*)"$/, (arg0) => {

        });

        then('the frontend shows the login screen', () => {

        });
    });

    test('The user exists in database', ({ given, when, then }) => {
        given('A user is registered', () => {

        });

        when(/^The user enters "(.*)", "(.*)", "(.*)", "(.*)", "(.*)"$/, (arg0, arg1, arg2, arg3, arg4) => {

        });

        then('the frontend sends the user and organization to the backend', () => {

        });

        then('the backend check the user exist in database', () => {

        });

        then('the backend response user exist message', () => {

        });

        then('the frontend show message', () => {

        });
    });
    test('The organization exists in database', ({ given, when, then }) => {
        given('A user is registered', () => {

        });

        when(/^The user enters "(.*)", "(.*)", "(.*)", "(.*)", "(.*)"$/, (arg0, arg1, arg2, arg3, arg4) => {

        });

        then('the frontend sends the user and organization to the backend', () => {

        });

        then('the backend check the user exist in database', () => {

        });

        then('the backend response organization exist message', () => {

        });

        then('the frontend show message', () => {

        });


    });

});
