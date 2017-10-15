import {AlertService} from '../_services/AlertService';

export const AlertServiceProvider = {provide: AlertService, useClass: AlertService};
