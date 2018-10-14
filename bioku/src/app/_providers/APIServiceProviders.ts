import { LoginService } from '../_services/LoginService';
import { LogoutService } from '../_services/LogoutService';
import { RegisterService } from '../_services/RegisterService';
import { ChangePasswordService } from '../_services/ChangePasswordService';
import { UpdateUserProfileService } from '../_services/UpdateUserProfileService';
import { UpdateGroupProfileService } from '../_services/UpdateGroupProfileService';
import { ResetPasswordService } from '../_services/ResetPasswordService';
import { GroupService } from '../_services/GroupService';
import { UserService } from '../_services/UserService';
import { ContainerService } from '../_services/ContainerService';
import { RefreshService } from '../_services/RefreshService';
import { CTypeService } from '../_services/CTypeService';

export const APIServiceProviders: Array<any> = [
        {provide: LoginService, useClass: LoginService},
        {provide: RefreshService, useClass: RefreshService},
        {provide: LogoutService, useClass: LogoutService},
        {provide: RegisterService, useClass: RegisterService},
        {provide: ChangePasswordService, useClass: ChangePasswordService},
        {provide: UpdateUserProfileService, useClass: UpdateUserProfileService},
        {provide: UpdateGroupProfileService, useClass: UpdateGroupProfileService},
        {provide: ResetPasswordService, useClass: ResetPasswordService},
        {provide: GroupService, useClass: GroupService},
        {provide: UserService, useClass: UserService},
        {provide: ContainerService, useClass: ContainerService},
        {provide: CTypeService, useClass: CTypeService},
    ];
