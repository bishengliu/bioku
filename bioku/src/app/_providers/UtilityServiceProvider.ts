import { UtilityService } from '../_services/UtilityService';
import { XlsxHelperService } from '../_services/XlsxHelperService';
import { ExcelUploadLoadService } from '../_services/ExcelUploadLoadService';

export const UtilityServiceProvider: Array<any> = [
    {provide: UtilityService, useClass: UtilityService},
    {provide: XlsxHelperService, useClass: XlsxHelperService },
    {provide: ExcelUploadLoadService, useClass: ExcelUploadLoadService },
];
