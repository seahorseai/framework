import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SigninResponse } from './signin-response.dto';
import { Organization, OrganizationDocument } from '../../organization-epic/organization.entity';
import { AccountModel, AccountModelHydrateDocument } from '../account.model';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { SigninRequest } from './signin-request.dto';


@Injectable()
export class SigninUserStory {

  constructor(
    @InjectModel(AccountModel.name)
    private userModel: Model<AccountModelHydrateDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>
  ) { }

  async execute(signinRequest: SigninRequest): Promise<SigninResponse> {

    try {

      const userCreated = await this.createUser(signinRequest);
      const organizationCreated = await this.createOrganization(signinRequest, userCreated._id);

      const userUpdated: AccountModelHydrateDocument = await this.userModel
        .findOneAndUpdate({ _id: userCreated._id }, { organizationId: organizationCreated.id }).exec()

      console.log('User updated: ', userUpdated);
      return this.userAndOrganizationToSignInResponse(userUpdated, organizationCreated);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
  private async createUser(signInRequest: SignInRequest): Promise<AccountModelHydrateDocument> {
    try {

      if (await this.userModel.findOne({ email: signInRequest.email })) {
        console.log('Email already exists')
        throw new ConflictException('This email already exists')
      }

      const user: AccountModel = this.signInRequestToUser(signInRequest);
      const userCreated = await this.userModel.create(user);
      console.log('User created: ', userCreated);
      return userCreated;

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  private signInRequestToUser(signInRequest: SignInRequest): AccountModel {
    const user: AccountModel = new AccountModel();
    user.email = signInRequest.email;
    user.name = signInRequest.name;
    user.password = signInRequest.password;
    return user;
  }

  

}
