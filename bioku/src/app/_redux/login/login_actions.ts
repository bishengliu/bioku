import { Action, ActionCreator, Dispatch } from 'redux';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {Observable} from 'rxjs';
import {LOGIN_CONSTANTS as C } from './login_constants';
import { AuthState } from './login_state';
import {User} from '../../_classes/User';
import {LoginService} from '../../_services/LoginService';
import{AlertService} from '../../_services/AlertService';

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
export const userAuthActionAsync = (loginService: LoginService, username: string, password: string, alertService: AlertService) => (dispatch: Dispatch<AuthState>, getState) =>{
        //auth user
        loginService.authUser(username, password)
        .subscribe(
            (data)=>{
            if(data.token.token){
                //dispatch set auth token action
                let setAuthTokenAction: SetAuthTokenAction = setAuthTokenActionCreator(data.token);
                dispatch(setAuthTokenAction);
            }          
            if (getState().token){
                let setAuthUserAction: SetAuthUserAction = setAuthUserActionCreator((<User>data.user));
                dispatch(setAuthUserAction)
            };             
        },
        (error)=>{
            console.log(error);
            //error
            alertService.error('Login Failed!');
        },
        ()=>{
            //success
            alertService.success('Login Success!');
        }
        );
}