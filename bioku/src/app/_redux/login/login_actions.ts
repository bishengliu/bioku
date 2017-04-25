import { Action, ActionCreator, Dispatch } from 'redux';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {Observable} from 'rxjs';
import {REDUX_CONSTANTS as C } from '../root/constants';
import { AppState, AppPartialState } from '../root/state';
import {User} from '../../_classes/User';
import {LoginService} from '../../_services/LoginService';
import{AlertService} from '../../_services/AlertService';
import {LogAppStateService} from '../../_services/LogAppStateService';
import { RegisterService } from '../../_services/RegisterService';
import {LoggerAction, loggerActionCreator} from '../logger/logger_actions';


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
export const userAuthActionAsync = 
(loginService: LoginService, username: string, password: string, alertService: AlertService, logAppStateService: LogAppStateService) => 
(dispatch: Dispatch<AppState>, getState) =>
{
        //auth user
        loginService.authUser(username, password)
        .subscribe(
            (data)=>{
                if(data.token.token){
                    //get state: apppartialstate
                    let preState: AppPartialState = logAppStateService.getAppPartialState();

                    //dispatch set auth token action
                    let setAuthTokenAction: SetAuthTokenAction = setAuthTokenActionCreator(data.token);
                    dispatch(setAuthTokenAction);

                    //get state: apppartialstate
                    let nextState: AppPartialState = logAppStateService.getAppPartialState();
                    let message: string = 'obtaining user token from server.'
                    //logger the redux action
                    logAppStateService.log(setAuthTokenAction.type, preState, nextState, message);
                }          
                if (getState().authInfo && getState().authInfo.token){
                    //get state: apppartialstate
                    let preState: AppPartialState = logAppStateService.getAppPartialState();

                    //dispatch action
                    let setAuthUserAction: SetAuthUserAction = setAuthUserActionCreator((<User>data.user));
                    dispatch(setAuthUserAction);

                    //get state: apppartialstate
                    let nextState: AppPartialState = logAppStateService.getAppPartialState();
                    let message: string = 'obtaining user details from server.'
                    //logger the reducx action
                    logAppStateService.log(setAuthUserAction.type, preState, nextState, message);
                };             
            },
            (error)=>{
                //get state: apppartialstate
                let preState: AppPartialState = logAppStateService.getAppPartialState();
                let nextState: AppPartialState = preState;
                let message: string = 'User login failed: ' + (error || 'server error!') ;
                logAppStateService.log('USER LOGIN', preState, nextState, message);
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


//register action
export const registerActionAsync =
(formData:FormData, registerService: RegisterService, http: Http, logAppStateService: LogAppStateService, alertService: AlertService) =>
(dispatch: Dispatch<AppState>, getState) =>
{
    registerService.registerUser(formData).subscribe(
            (data)=> {
                console.log(data);
                if(data.detail){
                    //loger redux
                    //get state: apppartialstate
                    let preState: AppPartialState = logAppStateService.getAppPartialState();
                    console.log(preState);
                    //dispatch set auth token action
                    //dispatch set token              
                    let setAuthTokenAction: SetAuthTokenAction = setAuthTokenActionCreator(data.token.token);
                    dispatch(setAuthTokenAction);

                    //displath set authUser
                    if('user' in data && data.user){
                        let setAuthUserAction: SetAuthUserAction = setAuthUserActionCreator((<User>data.user));
                        dispatch(setAuthUserAction);
                    }
                    
                    //get state: apppartialstate
                    let nextState: AppPartialState = logAppStateService.getAppPartialState();
                    let message: string = 'the new user registered!'
                    //logger the redux action
                    logAppStateService.log('REGISTER USER', preState, nextState, message);            
                }
            },
            (error)=>{
                //get state: apppartialstate
                let preState: AppPartialState = logAppStateService.getAppPartialState();
                let nextState: AppPartialState = preState;
                let message: string = 'User Register failed: ' + (error || 'server error!') ;
                logAppStateService.log('USER REGISTRATION', preState, nextState, message);
                console.log(error);
                //error
                alertService.error('Register Failed!');
            },
            ()=>{
                //success
                alertService.success('Register Success!', true);
            }
    )
}
