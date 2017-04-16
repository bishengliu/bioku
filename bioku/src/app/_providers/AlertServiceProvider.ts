import {AlertService} from '../_services/AlertService';

export var AlertServiceProvider: Array<any>= [
    {provide: AlertService, useClass: AlertService}
]