import {User} from '../../_classes/User';
import {AuthState} from '../login/login_state';
import {AppLog} from '../../_classes/Logger';

export interface AppPartialState{
    //auth user 
    authInfo: AuthState;
}

export interface AppState extends AppPartialState{
    //logs
    appLogs: Array<AppLog>; //DON'T CHANGE THE NAME OF THIS
}


//define initial state
export const initialAppState: AppState = {
    //auth user
    authInfo: {
        authUser: null,
        token: null
    },
    //logs
    appLogs: <AppLog[]>[]
}