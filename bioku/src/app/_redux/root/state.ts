import {User} from '../../_classes/User';
import {AuthState} from '../login/login_state';

export interface AppState{
    //auth user
    authInfo: AuthState;
}


export const initialAppState: AppState = {
    //auth user
    authInfo: {
        authUser: null,
        token: null
    },
}