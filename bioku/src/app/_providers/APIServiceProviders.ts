import {LoginService} from '../_services/LoginService';

export var APIServiceProviders: Array<any> = [
        {provide: LoginService, useClass: LoginService},
    ];