import { Injectable , Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RefreshService } from '../_services/RefreshService'
import { AlertService } from '../_services/AlertService'
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class CleanLocalStorageGuard implements CanActivate{
    constructor(@Inject(AppStore) private appStore, private router: Router, private alertService: AlertService, private refreshService: RefreshService){}
    canActivate(): boolean{
        this.refreshService.cleanState();
        return true;
    }
}