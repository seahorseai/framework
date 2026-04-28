import { Test, TestingModule } from '@nestjs/testing';
import { SigninUserStory } from './signin.user-story';
import { SigninRequest } from './signin-request.dto';
import { SigninResponse } from './signin-response.dto';
import { getModelToken } from '@nestjs/mongoose';
import { AccountModelHydrateDocument } from '../account.model';
import mongoose, { Model, Query } from 'mongoose';
import { createMock } from '@golevelup/ts-jest';
import { IAccountModel } from '../account.interface';

describe('SignInUserStory', () => {
  let signInUserStory: SigninUserStory;
  let modelAccountModelHydrateDocument: Model<AccountModelHydrateDocument>;
  const userModeltoken = getModelToken('AccountModel');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SigninUserStory,
        {
          provide: userModeltoken,
          useValue: {
              exec: jest.fn()
          }
        }
      ],

    }).compile();
    modelAccountModelHydrateDocument = module.get<Model<AccountModelHydrateDocument>>(userModeltoken);
    signInUserStory = module.get<SigninUserStory>(SigninUserStory);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(signInUserStory).toBeDefined();
  });


  describe('Signin user story', () => {
    test('should signin a new user', async () => {
      
      const sigInRequest: SigninRequest = {
        name: "pepe",
        email: "pepe@email.com",
        password: "pepe1234",
        confirmPassword: ''
      }

      const userId = new mongoose.Types.ObjectId();
      

      const iAccountModel: IAccountModel = {
        _id: userId,
        email: sigInRequest.email,
        name: sigInRequest.name,
        password: sigInRequest.password,
        };

      // jest.spyOn(signInUserStory, 'execute').mockReturnValueOnce(
      //   createMock<Query<AccountModelHydrateDocument, AccountModelHydrateDocument>>({
      //     execute: jest.fn().mockResolvedValueOnce(iAccountModel)
      //   }))

      const signInResponse: SigninResponse = await signInUserStory.execute(sigInRequest);
      console.log('siginnn: ', signInResponse)
      expect(signInResponse.name).toEqual(sigInRequest.name);
      expect(signInResponse.email).toEqual(sigInRequest.email);
      expect(signInResponse.organizationName).toEqual(sigInRequest.organizationName);
    });




 
  });

});
