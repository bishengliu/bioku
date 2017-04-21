//service to log redux action and state
import { Injectable, Inject } from '@angular/core';
import {AppPartialState, AppState } from '../_redux/root/state';
import { Store } from 'redux';
import {AppStore }from '../_providers/ReduxProviders';

import {LoggerAction, loggerActionCreator} from '../_redux/logger/logger_actions';

@Injectable()
export class LogAppStateService{
    constructor(@Inject(AppStore) private appStore: Store<AppState>){}
    //get AppPartialState
    getAppPartialState(): AppPartialState{
        let appState = this.appStore.getState();
        let appPartialState: AppPartialState ={ authInfo: null};
        for (let k in appState){
            if (k !== 'appLogs'){ //HARD CODE OBJECT KEY HERE
                appPartialState[k] = appState[k];
            }
        }        
        return appPartialState;
    }
    log(action: string, preState: AppPartialState, nextState: AppPartialState, message: string): void{
        let loggerAction: LoggerAction = loggerActionCreator(action, preState, nextState, message);
        this.appStore.dispatch(loggerAction);
    }

}