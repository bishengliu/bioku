import {User} from '../../_classes/User';
import {Group} from '../../_classes/Group';
import {AuthState} from '../account/account_state';
import { ContainerState } from '../container/container_state';
import {AppLog} from '../../_classes/Logger';

export interface AppPartialState {
    // auth user
    authInfo: AuthState;
    // containers
    containerInfo: ContainerState;
}

export interface AppState extends AppPartialState {
    // logs
    appLogs: Array<AppLog>; // DON'T CHANGE THE NAME OF THIS, REQUIRED BY LogAppStateService
}

// define initial state
export const initialAppState: AppState = {
    // auth user
    authInfo: {
        authUser: null,
        authGroup: null,
        token: null
    },
    containerInfo: {
        containers: null,
        currentContainer: null,
        currentBox: null
    },
    // logs
    appLogs: <AppLog[]>[]
}
