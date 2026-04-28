import { Module } from '@nestjs/common';

import { AccountModel, UserSchema } from './account.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from '../organization-epic/organization.entity';
import { Project, ProjectSchema } from '../project-epic/project.schema';
import { SigninUserStory } from './signin-user-story/signin.user-story';
import { LoginController } from './login-user-story/login.controller';
import { SigninController } from './signin-user-story/signin.controller';
import { LoginUserStory } from './login-user-story/login.user-story';


@Module({
  controllers: [LoginController, SigninController],
  providers: [SigninUserStory, LoginUserStory],
  imports: [MongooseModule.forFeature([
    { name: AccountModel.name, schema: UserSchema },
    { name: Organization.name, schema: OrganizationSchema },
    { name: Project.name, schema: ProjectSchema },

  ])]
})
export class AccountModule { }
