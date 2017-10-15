import { UtilityService } from '../_services/UtilityService';

export const UtilityServiceProvider: Array<any> = [
    {provide: UtilityService, useClass: UtilityService},
];
