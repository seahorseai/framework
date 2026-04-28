import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginRequest } from './login.request.dto';
import { LoginResponse } from './login.response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AccountModel, AccountModelHydrateDocument } from '../account.model';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument } from '../../organization-epic/organization.entity';

@Injectable()
export class LoginUserStory {
    constructor(
        @InjectModel(AccountModel.name)
        private userModel: Model<AccountModelHydrateDocument>,
        @InjectModel(Organization.name)
        private organizationModel: Model<OrganizationDocument>,
    ) { }

    async execute(logInRequest: LoginRequest): Promise<LoginResponse> {
        try {
            const userFounded: AccountModelHydrateDocument = await this.userModel.findOne({
                where: {
                    email: logInRequest.email,
                    password: logInRequest.password
                }
            });
            console.log(userFounded)
            if (!userFounded) {
                throw new UnauthorizedException('Email or password incorrect');
            }

            const organizationFounded: OrganizationDocument =
                await this.organizationModel.findById(userFounded.organizationId)
            if (!organizationFounded) {
                throw new NotFoundException('Organization not founded')
            }


            return this.setLogInResponse(userFounded, organizationFounded);
        } catch (error) {
            console.log(error)
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    private setLogInResponse(user: AccountModelHydrateDocument, organization: OrganizationDocument): LoginResponse {
        const logInResponse: LoginResponse = new LoginResponse();
        logInResponse.userId = user._id;
        logInResponse.name = user.name;
        logInResponse.email = user.email;
        logInResponse.organizationId = organization._id;
        logInResponse.organizationName = organization.name;
        return logInResponse;
    }

    private validateLogin(logInRequest: LoginRequest): void {
        const keys = Object.keys(logInRequest);
        
    }

}
