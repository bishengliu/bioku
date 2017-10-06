import { Injectable , Inject} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AlertService} from '../_services/AlertService'
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class PIGuard implements CanActivate{
    constructor(@Inject(AppStore) private appStore, private router: Router, private alertService: AlertService){}

    canActivate(): boolean{
        let state = this.appStore.getState();
        if (state != null && state.authInfo != null && state.authInfo.authUser != null && state.authInfo.authUser.roles != null && state.authInfo.authUser.roles.indexOf('PI') != -1){
            return true;
        }
        else{
            //reditrect
            this.alertService.error("Please login as PI!", true);
            this.router.navigate(['/denied']);
        }
        return false;
    }
}