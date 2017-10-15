import {LogAppStateService} from '../_services/LogAppStateService';

export const LogerProvider = {provide: LogAppStateService, useClass: LogAppStateService };
