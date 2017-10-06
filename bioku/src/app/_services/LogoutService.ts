//this service clear authUser and token in the appStore of redux
import { Injectable , Inject} from '@angular/core';
import { AppStore } from '../_providers/ReduxProviders';
import { LogAppStateService } from '../_services/LogAppStateService';
import { RefreshService } from '../_services/RefreshService';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
import { AppState, AppPartialState } from '../_redux/root/state';

//import redux action, actionCreator and reducer from login redux
import {unsetAuthUserActionCreator, unsetTokenActionCreator, unSetAuthGroupActionCreator} from '../_redux/account/account_actions';

@Injectable()
export class LogoutService{
    constructor(@Inject(AppStore) private appStore, private logAppStateService: LogAppStateService, private refreshService: RefreshService){};

    logOut(){
        //get pre state: apppartialstate
        let preState: AppPartialState = this.logAppStateService.getAppPartialState();

        //remove the token
        let unsetTokenAction = unsetTokenActionCreator();
        this.appStore.dispatch(unsetTokenAction);
        //remvoe the authUser
        let unsetAuthUserAction = unsetAuthUserActionCreator();
        this.appStore.dispatch(unsetAuthUserAction);
        //remove the authGroup
        let unSetAuthGroupAction = unSetAuthGroupActionCreator();
        this.appStore.dispatch(unSetAuthGroupAction);
        //clean localstore
        this.refreshService.cleanState();
        //get next state: apppartialstate
        let nextState: AppPartialState = this.logAppStateService.getAppPartialState();
        let message: string = 'Logout auth user.'
                    //logger the redux action
        this.logAppStateService.log((unsetTokenAction.type + '&' + unsetAuthUserAction.type), preState, nextState, message);
    }
}