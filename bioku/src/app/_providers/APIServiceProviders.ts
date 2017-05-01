import { LoginService } from '../_services/LoginService';
import { LogoutService } from '../_services/LogoutService';
import { RegisterService } from '../_services/RegisterService';
//import { UploadService } from '../_services/UploadService';
import { ChangePasswordService } from '../_services/ChangePasswordService';

export var APIServiceProviders: Array<any> = [
        {provide: LoginService, useClass: LoginService},
        {provide: LogoutService, useClass: LogoutService},
        {provide: RegisterService, useClass: RegisterService},
        //{provide: UploadService, useClass: UploadService},
        {provide: ChangePasswordService, useClass: ChangePasswordService},
    ];