import { Injectable , Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RefreshService } from '../_services/RefreshService'
import { AlertService } from '../_services/AlertService'
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(@Inject(AppStore) private appStore, private router: Router, private alertService: AlertService, private refreshService: RefreshService){}

    canActivate(): boolean{
        let state = this.appStore.getState();
        if(state != null && state.authInfo != null){
            if(state.authInfo.authUser == null || state.authInfo.token == null){
                //fetch data from locastorage
                //redux reducers
            }        
        }
        if (state != null && state.authInfo != null && state.authInfo.authUser != null){
            return true;
        }
        else{
            
            //reditrect
            this.alertService.error("Please login first!", true);
            this.router.navigate(['/login']);
        }
        return false;
    }
}

