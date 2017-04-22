//this service clear authUser and token in the appStore of redux
import { Injectable , Inject} from '@angular/core';
import { AppStore } from '../_providers/ReduxProviders';
import {LogAppStateService} from '../_services/LogAppStateService';
import {APP_CONFIG} from '../_providers/AppSettingProvider';
import { AppState, AppPartialState } from '../_redux/root/state';

//import redux action, actionCreator and reducer from login redux
import {unsetAuthUserActionCreator, unsetTokenActionCreator} from '../_redux/login/login_actions';

@Injectable()
export class LogoutService{
    constructor(@Inject(AppStore) private appStore, private logAppStateService: LogAppStateService){};

    logOut(){
        //get pre state: apppartialstate
        let preState: AppPartialState = this.logAppStateService.getAppPartialState();

        //remove the token
        let unsetTokenAction = unsetTokenActionCreator();
        this.appStore.dispatch(unsetTokenAction);
        //remvoe the authUser
        let unsetAuthUserAction = unsetAuthUserActionCreator();
        this.appStore.dispatch(unsetAuthUserAction);

        //get next state: apppartialstate
        let nextState: AppPartialState = this.logAppStateService.getAppPartialState();
        let message: string = 'Logout auth user.'
                    //logger the redux action
        this.logAppStateService.log((unsetTokenAction.type + '&' + unsetAuthUserAction.type), preState, nextState, message);
    }
}