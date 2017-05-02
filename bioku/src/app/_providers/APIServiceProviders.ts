import { LoginService } from '../_services/LoginService';
import { LogoutService } from '../_services/LogoutService';
import { RegisterService } from '../_services/RegisterService';
import { ChangePasswordService } from '../_services/ChangePasswordService';
import { UpdateUserProfileService } from '../_services/UpdateUserProfileService';


export var APIServiceProviders: Array<any> = [
        {provide: LoginService, useClass: LoginService},
        {provide: LogoutService, useClass: LogoutService},
        {provide: RegisterService, useClass: RegisterService},
        {provide: ChangePasswordService, useClass: ChangePasswordService},
        {provide: UpdateUserProfileService, useClass: UpdateUserProfileService},
    ];