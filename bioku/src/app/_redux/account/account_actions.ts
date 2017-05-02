import { Action, ActionCreator, Dispatch } from 'redux';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {Observable} from 'rxjs';
import {REDUX_CONSTANTS as C } from '../root/constants';
import { AppState, AppPartialState } from '../root/state';
import {User} from '../../_classes/User';
import {Group, GroupInfo} from '../../_classes/Group';
import {LoginService} from '../../_services/LoginService';
import{AlertService} from '../../_services/AlertService';
import {LogAppStateService} from '../../_services/LogAppStateService';
import { RegisterService } from '../../_services/RegisterService';
import { ChangePasswordService } from '../../_services/ChangePasswordService';

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

//SET_GROUP_DETAILS
export interface SetAuthGroupAction extends Action {
    authGroup: Array<Group>;
}

export const setAuthGroupActionCreator: ActionCreator<SetAuthGroupAction> = 
(groups: Array<Group>) => ({
    type: C.SET_GROUP_DETAILS,
    authGroup: groups
});
//UNSET_GROUP_DETAILS
export const unSetAuthGroupActionCreator: ActionCreator<Action> = 
() => ({
    type: C.UNSET_GROUP_DETAILS
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

                    if (getState().authInfo && getState().authInfo.token && 'user' in data && data.user){
                        
                        //dispatch action
                        let setAuthUserAction: SetAuthUserAction = setAuthUserActionCreator((<User>data.user));
                        dispatch(setAuthUserAction);

                        //dispatch authGroup
                        let setAuthGroupAction: SetAuthGroupAction = data.groups == null? setAuthGroupActionCreator(null) :setAuthGroupActionCreator((<Array<Group>>data.groups));
                        dispatch(setAuthGroupAction);
                    };

                    //get state: apppartialstate
                    let nextState: AppPartialState = logAppStateService.getAppPartialState();
                    let message: string = 'user login success!';
                    //logger the redux action
                    logAppStateService.log('USER LOGIN', preState, nextState, message);
                }          
                
                
                ////////////////////////////////////////////////////////////////////////////////////////////////////////
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

//WITH THUNK
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
                    //dispatch set auth token action
                    //dispatch set token              
                    let setAuthTokenAction: SetAuthTokenAction = setAuthTokenActionCreator(data.token.token);
                    dispatch(setAuthTokenAction);

                    //dispatch set authUser
                    if('user' in data && data.user){
                        let setAuthUserAction: SetAuthUserAction = setAuthUserActionCreator((<User>data.user));
                        dispatch(setAuthUserAction);
                    }
                    //dispatch authGroup
                    let setAuthGroupAction: SetAuthGroupAction = data.groups == null? setAuthGroupActionCreator(null) :setAuthGroupActionCreator((<Array<Group>>data.groups));
                    dispatch(setAuthGroupAction);

                    //get state: apppartialstate
                    let nextState: AppPartialState = logAppStateService.getAppPartialState();
                    let message: string = 'new user registered!'
                    //logger the redux action
                    logAppStateService.log('REGISTER USER', preState, nextState, message);
                    alertService.success('Register Success!', true);            
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
            }
    )
}


//change password
//with thunk
export const userChangePasswordActionAsync = 
(username: string, old_password: string, new_password: string, changePasswordService, alertService: AlertService, logAppStateService: LogAppStateService) => 
(dispatch: Dispatch<AppState>, getState) =>
{
        //auth user
        changePasswordService.changePassword(username, old_password, new_password)
        .subscribe(
            ()=>{
                //get state: apppartialstate
                    let preState: AppPartialState = logAppStateService.getAppPartialState();

                    //dispatch unset auth token action
                    let unsetAuthTokenAction: Action = unsetTokenActionCreator();
                    dispatch(unsetAuthTokenAction);

                    //dispatch unset auth user action
                    let unsetAuthUserAction: Action = unsetAuthUserActionCreator();
                    dispatch(unsetAuthUserAction);

                    //dispatch unset authGroup
                    let unSetAuthGroupAction: Action = unSetAuthGroupActionCreator();
                    dispatch(unSetAuthGroupAction);

                    //get state: apppartialstate
                    let nextState: AppPartialState = logAppStateService.getAppPartialState();
                    let message: string = 'user change password success!';
                    //logger the redux action
                    logAppStateService.log('USER CHANGE PASSWORD', preState, nextState, message);
                    //msg
                    alertService.success('Password Changed Successfully!', true);
            },
            (error)=>{
                //get state: apppartialstate
                let preState: AppPartialState = logAppStateService.getAppPartialState();
                let nextState: AppPartialState = preState;
                let message: string = 'User change password failed: ' + (error || 'server error!') ;
                logAppStateService.log('USER CHANGE PASSWORD', preState, nextState, message);
                console.log(error);
                //error
                alertService.error('Change Password Failed!');
            }
        );
}