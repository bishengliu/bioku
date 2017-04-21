import {User} from '../../_classes/User';
import {AuthState} from '../login/login_state';
import {LoggerState} from '../logger/logger_state';
import {AppLog} from '../../_classes/Logger';

export interface AppState{
    //auth user 
    authInfo: AuthState;
    



    //logs
    logs: LoggerState;
}


export const initialAppState: AppState = {
    //auth user
    authInfo: {
        authUser: null,
        token: null
    },
    //logs
    logs: new LoggerState(),
}