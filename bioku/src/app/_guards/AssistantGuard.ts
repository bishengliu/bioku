import { Injectable , Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertService } from '../_services/AlertService'
import { AppStore } from '../_providers/ReduxProviders';
import { Assistant } from '../_classes/Group';
import { User } from '../_classes/User';

@Injectable()
export class AssistantGuard implements CanActivate {
    constructor(@Inject(AppStore) private appStore, private router: Router, private alertService: AlertService) {}

    canActivate(): boolean {
        const state = this.appStore.getState();
        //check PI
        if (this.isPI()) {
            return true;
        } 
        else if(this.isAssistant()) {
            //check assistant
            return true;
        }
        else {
            // reditrect
            this.alertService.error('You have insufficient permissions!', true);
            this.router.navigate(['/denied']);
        }
        return false;
    }

    isPI(): boolean {
        const state = this.appStore.getState();
        if (state != null && state.authInfo != null && state.authInfo.authUser != null
            && state.authInfo.authUser.roles != null 
            && state.authInfo.authUser.roles.indexOf('PI') !== -1) {
            return true;
        } else {
            return false;
        }
    }

    isAssistant(): boolean {
        let email: string = '';
        const state = this.appStore.getState();
        if(state != null && state.authInfo != null && state.authInfo.authUser != null){
            email = state.authInfo.authUser.email;
        }
        if(state != null 
            && state.authInfo != null 
            && state.authInfo.authGroup.length > 0
            && state.authInfo.authGroup[0].assistants.length > 0){
                //find the assistant
                const assistant: Assistant = state.authInfo.authGroup[0].assistants.find((a: Assistant, i) => {
                    return a.user.email = email;
                })
                if(assistant != undefined){
                    return true;
                }
        }
        return false;
    }
}
