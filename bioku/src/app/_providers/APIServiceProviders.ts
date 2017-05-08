import { LoginService } from '../_services/LoginService';
import { LogoutService } from '../_services/LogoutService';
import { RegisterService } from '../_services/RegisterService';
import { ChangePasswordService } from '../_services/ChangePasswordService';
import { UpdateUserProfileService } from '../_services/UpdateUserProfileService';
import { UpdateGroupProfileService } from '../_services/UpdateGroupProfileService';
import { GroupService } from '../_services/GroupService';


export var APIServiceProviders: Array<any> = [
        {provide: LoginService, useClass: LoginService},
        {provide: LogoutService, useClass: LogoutService},
        {provide: RegisterService, useClass: RegisterService},
        {provide: ChangePasswordService, useClass: ChangePasswordService},
        {provide: UpdateUserProfileService, useClass: UpdateUserProfileService},
        {provide: UpdateGroupProfileService, useClass: UpdateGroupProfileService},
        {provide: GroupService, useClass: GroupService}
    ];