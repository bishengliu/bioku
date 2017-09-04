import { LocalStorageService } from '../_services/LocalStorageService';

export var LocalStorageServiceProvider: Array<any> = [
    {provide: LocalStorageService, useClass: LocalStorageService },
]