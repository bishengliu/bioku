import { Injectable , Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RefreshService } from '../_services/RefreshService'
import { AlertService } from '../_services/AlertService'
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class FetchAuthInfoGuard implements CanActivate{
    constructor(@Inject(AppStore) private appStore, private refreshService: RefreshService){}
    canActivate(): boolean{
        console.log('fetch local storage');
        return true;
    }
}