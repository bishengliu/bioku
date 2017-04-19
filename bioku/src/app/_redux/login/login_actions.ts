import { Action, ActionCreator, Dispatch } from 'redux';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {Observable} from 'rxjs';
import {LOGIN_CONSTANTS as C } from './login_constants';
import { AuthState } from './login_state';
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
export const userAuthActionAsync = (http: Http, appSetting: any, username: string, password: string) => (dispatch: Dispatch<AuthState>, getState) =>{

    //url to get token for authentication
    const token_url: string = appSetting.URL + appSetting.TOKEN_URL;
    //url for get auth user details
    const user_detail: string  = appSetting.URL + appSetting.AUTH_USER;
    //request the token
    //data
    let body: string = JSON.stringify({'username': username, 'password': password});
    //let body = {'username': username, 'password': password};
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    http.post(token_url, body, options)
        .map((response: Response) =>response.json())         
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
        .subscribe((data)=>{
            let setAuthTokenAction: SetAuthTokenAction = setAuthTokenActionCreator(data);
            dispatch(setAuthTokenAction);

            if (getState().token){

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
                let setAuthUserAction: SetAuthUserAction = setAuthUserActionCreator(authUser);
                dispatch(setAuthUserAction)}
        })
}