import { LocalStorageService } from '../_services/LocalStorageService';

export const LocalStorageServiceProvider: Array<any> = [
    {provide: LocalStorageService, useClass: LocalStorageService },
];
