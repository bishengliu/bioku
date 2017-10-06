import { Injectable , Inject} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { AlertService } from '../_services/AlertService'
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class AdminGuard implements CanActivate{
    constructor(@Inject(AppStore) private appStore, private router: Router, private alertService: AlertService){}

    canActivate(): boolean{
        let state = this.appStore.getState();
        if (state != null && state.authInfo != null && state.authInfo.authUser != null && state.authInfo.authUser.is_superuser){
            return true;
        }
        else{           
            //reditrect
            this.alertService.error("Please login as Admin!", true);
            this.router.navigate(['/denied']);
        }
        return false;
    }
}
