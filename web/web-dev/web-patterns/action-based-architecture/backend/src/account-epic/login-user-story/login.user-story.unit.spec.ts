import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserStory } from './login.user-story';
import { LoginRequest } from './login.request.dto';
import { LoginResponse } from './login.response.dto';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AccountModelHydrateDocument } from '../account.model';
import { OrganizationDocument } from '../../organization-epic/organization.entity';

import { UnauthorizedException } from '@nestjs/common';
import { IAccountModel, MongooseObjectId } from '../account.interface';

describe('LoginService', () => {
  let service: LoginUserStory;
  let userModel: Model<AccountModelHydrateDocument>;
  const userModelToken = getModelToken('User');
  let organizationModel: Model<OrganizationDocument>;
  const organizationModelToken = getModelToken('Organization')

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUserStory,
        {
          provide: userModelToken,
          useValue: {
            findOne: jest.fn(),
          }
        },
        {
          provide: organizationModelToken,
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn()
          }
        },
      ],
    }).compile();
    userModel = module.get<Model<AccountModelHydrateDocument>>(userModelToken);
    organizationModel = module.get<Model<OrganizationDocument>>(organizationModelToken);
    service = module.get<LoginUserStory>(LoginUserStory);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('logIn', () => {

    test('should login a user when the form is filled correctly and the user is registered', async () => {
      const logInRequest: LoginRequest = {
        email: 'pepe@email.com',
        password: 'pepe1234',
      };

      const iAccountModelMock: IAccountModel = {
        _id: MongooseObjectId,
        email: logInRequest.email,
        name: 'pepe',
        password: 'pepe1234'
      };

    

      jest.spyOn(userModel, 'findOne').mockResolvedValue(iAccountModelMock);
    

      const logInResponse: LoginResponse = await service.execute(logInRequest);

      expect(logInResponse.email).toEqual(logInRequest.email);
      expect(logInResponse.userId).toEqual(iAccountModelMock._id);
      expect(logInResponse.name).toEqual(iAccountModelMock.name);
      expect(logInResponse.organizationId).toEqual(iAccountModelMock._id);
      expect(logInResponse.organizationName).toEqual(iAccountModelMock.name);
      expect(userModel.findOne).toHaveBeenCalled();
      expect(organizationModel.findById).toHaveBeenCalled();
      expect(organizationModel.findById).toHaveBeenCalledTimes(1);
      expect(userModel.findOne).toHaveBeenCalledTimes(1);
    });

    test('should not exists a user (The user fills correctly the form to log in and the user is not registered)', async () => {
      const logInRequest: LoginRequest = {
        email: 'pepe@email.com',
        password: 'pepe1234',
      };
      jest.spyOn(userModel, 'findOne').mockResolvedValue(false);
      await expect(service.execute(logInRequest))
        .rejects.toThrow(new UnauthorizedException('Email or password incorrect'))
    })

    test('should not exists a user (The user fills correctly the form to log in and the user is not registered)', async () => {
      const logInRequest: LoginRequest = {
        email: 'pepe@email.com',
        password: 'pepe1234',
      };
      jest.spyOn(userModel, 'findOne').mockResolvedValue(false);
      await expect(service.execute(logInRequest))
        .rejects.toThrow(new UnauthorizedException('Email or password incorrect'))
    })
  });




});
