import { UtilityService } from '../_services/UtilityService';
import { XlsxHelperService } from '../_services/XlsxHelperService';

export const UtilityServiceProvider: Array<any> = [
    {provide: UtilityService, useClass: UtilityService},
    {provide: XlsxHelperService, useClass: XlsxHelperService },
];
