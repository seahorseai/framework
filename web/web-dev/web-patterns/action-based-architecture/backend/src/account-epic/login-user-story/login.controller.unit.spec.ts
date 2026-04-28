import { Test, TestingModule } from '@nestjs/testing';

import mongoose from 'mongoose';
import { LoginController } from './login.controller';
import { LoginUserStory } from './login.user-story';
import { LoginRequest } from './login.request.dto';
import { LoginResponse } from './login.response.dto';




describe('AccountController', () => {
  let controller: LoginController;

  const signinUserStoryMock = {
    execute: jest.fn(),
  }
  const loginUserStoryMock = {
    logIn: jest.fn(),
  }


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginUserStory,
          useValue: signinUserStoryMock,
        },

      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });



  describe('logIn', () => {
    it('should logIn a user', async () => {

      const logInRequest: LoginRequest = new LoginRequest();
      logInRequest.email = "pepe@mail.com";
      logInRequest.password = "changeme";


      const logInResponseMock: LoginResponse = new LoginResponse();
      logInResponseMock.userId = new mongoose.Types.ObjectId();
      logInResponseMock.email = "pepe@mail.com";
      logInResponseMock.name = "pepe";


      jest.spyOn(loginUserStoryMock, 'logIn').mockResolvedValue(logInResponseMock);

      const logInResponse: LoginResponse = await controller.logiIn(logInRequest);

      expect(loginUserStoryMock.logIn).toHaveBeenCalled();
      expect(loginUserStoryMock.logIn).toHaveBeenCalledWith(logInRequest);
      expect(logInResponse.email).toEqual(logInRequest.email);
      expect(logInResponse.name).toEqual("pepe");
    });
  });



});
