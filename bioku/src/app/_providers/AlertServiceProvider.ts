import {AlertService} from '../_services/AlertService';

export var AlertServiceProvider = {provide: AlertService, useClass: AlertService};