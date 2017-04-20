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
        .do(data=>{console.log(data)}) //token object
        //merge obserable to further request user info
        .mergeMap( (token_obj: any) => {
            //token_obj = {'token': '', 'user': 1}
            

            //further to get user details
            let token = token_obj.token;
            let headers = new Headers({ 'Authorization': 'Token '+ token });
            let options = new RequestOptions({ headers: headers });
            //return the new obserable
            return http.get(user_detail, options)
                        .map((response: Response) =>response.json())
                        .do(user_obj=>{console.log(user_obj)})  //user object
                        .map((user_obj: any) => {
                            return {'user': user_obj, 'token': token_obj}; //combined object
                        });
        })
        .do(data=>{console.log(data)})         
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
        .subscribe((data)=>{
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
        ()=>{},
        ()=>{});
}