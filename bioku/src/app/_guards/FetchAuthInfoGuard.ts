import { Injectable , Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RefreshService } from '../_services/RefreshService'
import { AlertService } from '../_services/AlertService'
import { AppStore } from '../_providers/ReduxProviders';
import { AuthState } from '../_redux//account/account_state';
import { SetAuthInfoAction, setAuthInfoActionCreator } from '../_redux/account/account_actions';

@Injectable()
export class FetchAuthInfoGuard implements CanActivate {
    constructor(@Inject(AppStore) private appStore, private refreshService: RefreshService) {}
    canActivate(): boolean {
        const state = this.appStore.getState();
        if (state != null && state.authInfo != null) {
            if (state.authInfo.authUser == null || state.authInfo.token == null) {
                // fetch data from locastorage
                const authInfo: AuthState = this.refreshService.fetchAuthState();
                // redux reducers
                const setAuthInfoAction: SetAuthInfoAction = setAuthInfoActionCreator(authInfo);
                this.appStore.dispatch(setAuthInfoAction);
            }
        }
        return true;
    }
}
