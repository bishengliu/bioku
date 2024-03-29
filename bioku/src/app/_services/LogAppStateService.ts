// service to log redux action and state
import { Injectable, Inject } from '@angular/core';
import {AppPartialState, AppState } from '../_redux/root/state';
import { createStore } from 'redux';
import {AppStore } from '../_providers/ReduxProviders';

import {LoggerAction, loggerActionCreator} from '../_redux/logger/logger_actions';

@Injectable()
export class LogAppStateService {
    constructor(@Inject(AppStore) private appStore) {}
    // get AppPartialState
    getAppPartialState(): AppPartialState {
        const appState = this.appStore.getState();
        const appPartialState: AppPartialState = {
                authInfo: null,
                containerInfo: null
            };
        for (let k in appState) {
            if (k !== 'appLogs') { // HARD CODE OBJECT KEY HERE
                appPartialState[k] = appState[k];
            }
        }
        return appPartialState;
    }
    log(action: string, preState: AppPartialState, nextState: AppPartialState, message: string): void {
        // let loggerAction: LoggerAction = loggerActionCreator(action, preState, nextState, message);
        // this.appStore.dispatch(loggerAction);
    }

}
