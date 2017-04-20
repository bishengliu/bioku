import { Action } from 'redux';
import { AuthState } from './login_state';
import { AppState } from '../root/state';
import { initialAppState } from '../root/state';
import { User } from '../../_classes/User';
import {LOGIN_CONSTANTS as C } from './login_constants';
import {SetAuthUserAction, SetAuthTokenAction} from './login_actions';

//initial auth status
const initialState: AuthState = initialAppState.authInfo;

//define reducers
export const authReducer = 
function (state: AuthState = initialState, action: Action): AuthState {
    switch(action.type){
        case C.SET_AUTH_USER:
            //set auth user
            const user: User = (<SetAuthUserAction>action).authUser;
            return {
                authUser: user,
                token: state.token
            }   
        case C.SET_TOKEN:
            //set token
            const token: string = (<SetAuthTokenAction>action).token;
            return {
                authUser: state.authUser,
                token: token
            }
        case C.UNSET_AUTH_USER:
            //clear auth user, logout
            return {
                authUser: null,
                token: null
            }
        case C.UNSET_TOKEN:
            //unset token
            return {
                authUser: state.authUser,
                token: null
            }
        default:
            return state;
    }
}
