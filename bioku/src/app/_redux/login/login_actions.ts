import { Action, ActionCreator } from 'redux';
import {LOGIN_CONSTANTS as C } from './login_constants';
import {User} from '../../_classes/User';
 

//SET_AUTH_USER
export interface SetAuthUserAction extends Action {
    authUser: User;
}

export const setAuthUserActionCreator: ActionCreator<SetAuthUserAction> = 
(user: User) => ({
    type: C.SET_AUTH_USER,
    authUser: user
});

//SET_TOKEN
export interface SetAuthTokenAction extends Action {
    token: string;
}

export const setAuthTokenActionCreator: ActionCreator<SetAuthTokenAction> = 
(token: string) => ({
    type: C.SET_TOKEN,
    token: token
});

//UNSET_AUTH_USER
export const unsetAuthUserActionCreator: ActionCreator<Action> = 
() => ({
    type: C.UNSET_AUTH_USER
});
//UNSET_TOKEN
export const unsetTokenActionCreator: ActionCreator<Action> = 
() => ({
    type: C.UNSET_TOKEN
});

//with thunk
export const userAuthActionAsync = (username: string, password: string) => (dispatch, getState) =>{

    let authUser = {
    id: 1,
    name: 'bisheng',
    first_name: 'Bisheng',
    last_name: 'Liu',
    photo_url: 'url',
    telephone: 12345,
    roles: ['Admin', 'PI'],
    groups: [1, 2],
    }

    setTimeout(()=>{
        console.log("set user");
        let setAuthUserAction: SetAuthUserAction = setAuthUserActionCreator(authUser);
        dispatch(setAuthUserAction);
        console.log(getState())
    }, 2000)

    setTimeout(()=>{
        console.log("set token");
        let setAuthTokenAction: SetAuthTokenAction = setAuthTokenActionCreator('dwegergrtebhsfjksahdwkjflhw');
        dispatch(setAuthTokenAction);
        console.log(getState())
    }, 5000)

    console.log(getState())
}