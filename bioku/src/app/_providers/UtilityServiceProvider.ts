import { UtilityService } from '../_services/UtilityService';

export var UtilityServiceProvider: Array<any> = [
    {provide: UtilityService, useClass: UtilityService},
]