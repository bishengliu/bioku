import { LoginService } from '../_services/LoginService';
import { LogoutService } from '../_services/LogoutService';


export var APIServiceProviders: Array<any> = [
        {provide: LoginService, useClass: LoginService},
        {provide: LogoutService, useClass: LogoutService},
    ];