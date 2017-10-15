import { Action, ActionCreator, Dispatch } from 'redux';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { REDUX_CONSTANTS as C } from '../root/constants';
import { AppState, AppPartialState } from '../root/state';
import { User, TokenObj } from '../../_classes/User';
import { Group, GroupInfo } from '../../_classes/Group';
import { LoginService } from '../../_services/LoginService';
import { AlertService } from '../../_services/AlertService';
import { LogAppStateService } from '../../_services/LogAppStateService';
import { RegisterService } from '../../_services/RegisterService';
import { ChangePasswordService } from '../../_services/ChangePasswordService';
import { UpdateUserProfileService } from '../../_services/UpdateUserProfileService';
import { UpdateGroupProfileService } from '../../_services/UpdateGroupProfileService';
import { GroupService } from '../../_services/GroupService';
import { RefreshService } from '../../_services/RefreshService';
import {LoggerAction, loggerActionCreator} from '../logger/logger_actions';

import { AuthState } from '../account/account_state';
// import { ContainerState } from '../container/container_state';

// SET_AUTH_INFO
export interface SetAuthInfoAction extends Action {
    authInfo: AuthState;
}

export const setAuthInfoActionCreator: ActionCreator<SetAuthInfoAction> =
(authInfo: AuthState) => ({
    type: C.SET_AUTH_INFO,
    authInfo: authInfo
});

// SET_AUTH_USER
export interface SetAuthUserAction extends Action {
    authUser: User;
}

export const setAuthUserActionCreator: ActionCreator<SetAuthUserAction> =
(user: User) => ({
    type: C.SET_AUTH_USER,
    authUser: user
});

// SET_TOKEN
export interface SetAuthTokenAction extends Action {
    token: TokenObj;
}

export const setAuthTokenActionCreator: ActionCreator<SetAuthTokenAction> =
(token: TokenObj) => ({
    type: C.SET_TOKEN,
    token: token
});

// UNSET_AUTH_USER
export const unsetAuthUserActionCreator: ActionCreator<Action> =
() => ({
    type: C.UNSET_AUTH_USER
});

// UNSET_TOKEN
export const unsetTokenActionCreator: ActionCreator<Action> =
() => ({
    type: C.UNSET_TOKEN
});

// SET_GROUP_DETAILS
export interface SetAuthGroupAction extends Action {
    authGroup: Array<Group>;
}

export const setAuthGroupActionCreator: ActionCreator<SetAuthGroupAction> =
(groups: Array<Group>) => ({
    type: C.SET_GROUP_DETAILS,
    authGroup: groups
});

// UNSET_GROUP_DETAILS
export const unSetAuthGroupActionCreator: ActionCreator<Action> =
() => ({
    type: C.UNSET_GROUP_DETAILS
});

// with thunk
export const userAuthActionAsync =
(loginService: LoginService, username: string, password: string, alertService: AlertService,
    logAppStateService: LogAppStateService, refreshService: RefreshService) =>
(dispatch: Dispatch<AppState>, getState) => {
        // auth user
        loginService.authUser(username, password)
        .subscribe(
            (data) => {
                if (data.token.token) {
                    // get state: apppartialstate
                    const preState: AppPartialState = logAppStateService.getAppPartialState();

                    // dispatch set auth token action
                    const setAuthTokenAction: SetAuthTokenAction = setAuthTokenActionCreator(data.token);
                    dispatch(setAuthTokenAction);

                    if (getState().authInfo && getState().authInfo.token && 'user' in data && data.user) {

                        // dispatch action
                        const setAuthUserAction: SetAuthUserAction = setAuthUserActionCreator((<User>data.user));
                        dispatch(setAuthUserAction);

                        // dispatch authGroup
                        const setAuthGroupAction: SetAuthGroupAction = data.groups == null ?
                            setAuthGroupActionCreator(null) : setAuthGroupActionCreator((<Array<Group>>data.groups));
                        dispatch(setAuthGroupAction);
                    };

                    // dumpdata to the locastorage
                    refreshService.dumpAuthState(getState().authInfo);

                    // get state: apppartialstate
                    const nextState: AppPartialState = logAppStateService.getAppPartialState();
                    const message = 'user login success!';

                    // logger the redux action
                    logAppStateService.log('USER LOGIN', preState, nextState, message);
                }
                ////////////////////////////////////////////////////////////////////////////////////////////////////////
            },
            (error) => {
                // get state: apppartialstate
                const preState: AppPartialState = logAppStateService.getAppPartialState();
                const nextState: AppPartialState = preState;
                // remove localstorage
                refreshService.cleanState();
                const message = 'user login failed: ' + (error || 'server error!') ;
                logAppStateService.log('USER LOGIN', preState, nextState, message);
                // error
                alertService.error('Login Failed!');
            },
            () => {
                // success
                alertService.success('Login Success!');
            }
        );
}

// WITH THUNK
// register action
export const registerActionAsync =
(formData: FormData, registerService: RegisterService, http: Http,
    logAppStateService: LogAppStateService, alertService: AlertService, refreshService: RefreshService) =>
(dispatch: Dispatch<AppState>, getState) => {
    registerService.registerUser(formData).subscribe(
            (data) => {
                if (data.detail) {
                    // loger redux
                    // get state: apppartialstate
                    const preState: AppPartialState = logAppStateService.getAppPartialState();
                    // dispatch set auth token action
                    // dispatch set token
                    const setAuthTokenAction: SetAuthTokenAction = setAuthTokenActionCreator(data.token.token);
                    dispatch(setAuthTokenAction);

                    // dispatch set authUser
                    if ('user' in data && data.user) {
                        const setAuthUserAction: SetAuthUserAction = setAuthUserActionCreator((<User>data.user));
                        dispatch(setAuthUserAction);
                    }
                    // dispatch authGroup
                    const setAuthGroupAction: SetAuthGroupAction = data.groups == null ?
                          setAuthGroupActionCreator(null) : setAuthGroupActionCreator((<Array<Group>>data.groups));
                    dispatch(setAuthGroupAction);

                    // dumpdata to the locastorage
                    refreshService.dumpAuthState(getState().authInfo);

                    // get state: apppartialstate
                    const nextState: AppPartialState = logAppStateService.getAppPartialState();
                    const message = 'new user registered!'
                    // logger the redux action
                    logAppStateService.log('REGISTER USER', preState, nextState, message);
                    alertService.success('Registration Succeeded!', true);
                }
            },
            (error) => {
                // get state: apppartialstate
                const preState: AppPartialState = logAppStateService.getAppPartialState();
                const nextState: AppPartialState = preState;
                // remove localstorage
                refreshService.cleanState();
                const message = 'user registration failed: ' + (error || 'server error!') ;
                logAppStateService.log('USER REGISTRATION', preState, nextState, message);
                console.log(error);
                // error
                alertService.error('Registration Failed!');
            }
    )
}

// change password
// with thunk
export const userChangePasswordActionAsync =
(username: string, old_password: string, new_password: string, changePasswordService,
     alertService: AlertService, logAppStateService: LogAppStateService, refreshService: RefreshService) =>
(dispatch: Dispatch<AppState>, getState) => {
        // auth user
        changePasswordService.changePassword(username, old_password, new_password)
        .subscribe(
            () => {
                // get state: apppartialstate
                const preState: AppPartialState = logAppStateService.getAppPartialState();

                // dispatch unset auth token action
                const unsetAuthTokenAction: Action = unsetTokenActionCreator();
                dispatch(unsetAuthTokenAction);

                // dispatch unset auth user action
                const unsetAuthUserAction: Action = unsetAuthUserActionCreator();
                dispatch(unsetAuthUserAction);

                // dispatch unset authGroup
                const unSetAuthGroupAction: Action = unSetAuthGroupActionCreator();
                dispatch(unSetAuthGroupAction);

                // remove localstorage
                refreshService.cleanState();

                // get state: apppartialstate
                const nextState: AppPartialState = logAppStateService.getAppPartialState();
                const message = 'user change password success!';
                // logger the redux action
                logAppStateService.log('USER CHANGE PASSWORD', preState, nextState, message);
                // msg
                alertService.success('Password Changed Successfully!', true);
            },
            (error) => {
                // get state: apppartialstate
                const preState: AppPartialState = logAppStateService.getAppPartialState();
                const nextState: AppPartialState = preState;

                // dumpdata to the locastorage
                refreshService.dumpAuthState(getState().authInfo);

                const message: string = 'User change password failed: ' + (error || 'server error!') ;
                logAppStateService.log('USER CHANGE PASSWORD', preState, nextState, message);
                console.log(error);
                // error
                alertService.error('Change Password Failed!');
            }
        );
}

// update user profile thunk
export const updateProfileActionAsync =
(formData: FormData, pk: number, token: string, updateUserProfileService: UpdateUserProfileService,
     http: Http, logAppStateService: LogAppStateService, alertService: AlertService, refreshService: RefreshService) =>
(dispatch: Dispatch<AppState>, getState) => {
    updateUserProfileService.update(formData, pk, token).subscribe(
            (data) => {
                if (data.detail) {
                    // loger redux
                    // get state: apppartialstate
                    const preState: AppPartialState = logAppStateService.getAppPartialState();
                    // dispatch set auth token action
                    // dispatch set token
                    const setAuthTokenAction: SetAuthTokenAction = setAuthTokenActionCreator(data.token.token);
                    dispatch(setAuthTokenAction);

                    // dispatch set authUser
                    if ('user' in data && data.user) {
                        const setAuthUserAction: SetAuthUserAction = setAuthUserActionCreator((<User>data.user));
                        dispatch(setAuthUserAction);
                    }
                    // dispatch authGroup
                    const setAuthGroupAction: SetAuthGroupAction = data.groups == null ?
                          setAuthGroupActionCreator(null) : setAuthGroupActionCreator((<Array<Group>>data.groups));
                    dispatch(setAuthGroupAction);

                    // dumpdata to the locastorage
                    refreshService.dumpAuthState(getState().authInfo);

                    // get state: apppartialstate
                    const nextState: AppPartialState = logAppStateService.getAppPartialState();
                    const message = 'user profile updated!'
                    // logger the redux action
                    logAppStateService.log('UPDATE USER PROFILE', preState, nextState, message);
                    alertService.success('Update User Profile Succeeded!', true);
                }
            },
            (error) => {
                // get state: apppartialstate
                const preState: AppPartialState = logAppStateService.getAppPartialState();
                const nextState: AppPartialState = preState;

                // dumpdata to the locastorage
                refreshService.dumpAuthState(getState().authInfo);

                const message: string = 'update user profile failed: ' + (error || 'server error!') ;
                logAppStateService.log('UPDATE USER PROFILE', preState, nextState, message);
                console.log(error);
                // error
                alertService.error('Update User Profile Failed!');
            }
    )
}

// update group profile thunk
export const updateGroupProfileActionAsync =
(formData: FormData, pk: number, updateGroupProfileService: UpdateGroupProfileService, http: Http,
    logAppStateService: LogAppStateService, alertService: AlertService, refreshService: RefreshService) =>
(dispatch: Dispatch<AppState>, getState) => {
    updateGroupProfileService.update(formData, pk).subscribe(
        data => {
            // get state: apppartialstate
            const preState: AppPartialState = logAppStateService.getAppPartialState();
            // dispatch authGroup
            const setAuthGroupAction: SetAuthGroupAction = data.groups == null ?
                  setAuthGroupActionCreator(null) : setAuthGroupActionCreator((<Array<Group>>data.groups));
            dispatch(setAuthGroupAction);

            // dumpdata to the locastorage
            refreshService.dumpAuthState(getState().authInfo);

            // get state: apppartialstate
            const nextState: AppPartialState = logAppStateService.getAppPartialState();
            const message = 'update group profile succeeded!'
            // logger the redux action
            logAppStateService.log('UPDATE GROUP PROFILE', preState, nextState, message);
            alertService.success('Update Group Profile Succeeded!', true);
        },
        error => {
            // get state: apppartialstate
            const preState: AppPartialState = logAppStateService.getAppPartialState();
            const nextState: AppPartialState = preState;
            // remove localstorage
            refreshService.cleanState();

            const message: string = 'update group profile failed: ' + (error || 'server error!') ;
            logAppStateService.log('UPDATE GROUP PROFILE', preState, nextState, message);
            console.log(error);
            // error
            alertService.error('Update Group Profile Failed!');
        }
    )
}

// add assistant to one group
export const addAssistantAsync =
(group_pk: number, email: string, groupService: GroupService, alertService: AlertService, logAppStateService: LogAppStateService) =>
(dispatch: Dispatch<AppState>, getState) => {
    groupService.addAssistant(group_pk, email)
    .subscribe(
        (data: any) => {
            // get state: apppartialstate
            const preState: AppPartialState = logAppStateService.getAppPartialState();
            // dispatch authGroup
            const setAuthGroupAction: SetAuthGroupAction = data.groups == null ?
                  setAuthGroupActionCreator(null) : setAuthGroupActionCreator((<Array<Group>>data.groups));
            dispatch(setAuthGroupAction);

            // get state: apppartialstate
            const nextState: AppPartialState = logAppStateService.getAppPartialState();
            const message = 'group assistant added!'
            // logger the redux action
            logAppStateService.log('ADD GROUP ASSISTANT BY PI', preState, nextState, message);
            alertService.success('Add Group Assistant Succeeded!', true);
        },
        (error) => {
            // get state: apppartialstate
            const preState: AppPartialState = logAppStateService.getAppPartialState();
            const nextState: AppPartialState = preState;
            const message: string = 'add group assistant failed: ' + (error || 'server error!') ;
            logAppStateService.log('ADD GROUP ASSISTANT BY PI', preState, nextState, message);
            console.log(error);
            alertService.error('Add Group Assistant Failed!');
        })
}

// add researcher to one group
export const addMemberAsync =
(group_pk: number, email: string, groupService: GroupService, alertService: AlertService, logAppStateService: LogAppStateService) =>
(dispatch: Dispatch<AppState>, getState) => {
    groupService.addMember(group_pk, email)
    .subscribe(
        (data: any) => {
            // get state: apppartialstate
            const preState: AppPartialState = logAppStateService.getAppPartialState();
            // dispatch authGroup
            const setAuthGroupAction: SetAuthGroupAction = data.groups == null ?
                  setAuthGroupActionCreator(null) : setAuthGroupActionCreator((<Array<Group>>data.groups));
            dispatch(setAuthGroupAction);

            // get state: apppartialstate
            const nextState: AppPartialState = logAppStateService.getAppPartialState();
            const message = 'group member added!'
            // logger the redux action
            logAppStateService.log('ADD GROUP MEMBER BY PI', preState, nextState, message);
            alertService.success('Add Group Member Succeeded!', true);
        },
        (error) => {
            // get state: apppartialstate
            const preState: AppPartialState = logAppStateService.getAppPartialState();
            const nextState: AppPartialState = preState;
            const message: string = 'add group member failed: ' + (error || 'server error!') ;
            logAppStateService.log('ADD GROUP MEMEBER BY PI', preState, nextState, message);
            console.log(error);
            // error
            alertService.error('Add Group Memeber Failed!');
        })
}

// remove assistant to one group
export const removeAssistantAsync =
(group_pk: number, user_pk: number, groupService: GroupService, alertService: AlertService, logAppStateService: LogAppStateService) =>
(dispatch: Dispatch<AppState>, getState) => {
    groupService.removeAssistant(group_pk, user_pk)
    .subscribe(
        (data: any) => {
            // get state: apppartialstate
            const preState: AppPartialState = logAppStateService.getAppPartialState();
            // dispatch authGroup
            const setAuthGroupAction: SetAuthGroupAction = data.groups == null ?
                  setAuthGroupActionCreator(null) : setAuthGroupActionCreator((<Array<Group>>data.groups));
            dispatch(setAuthGroupAction);

            // get state: apppartialstate
            const nextState: AppPartialState = logAppStateService.getAppPartialState();
            const message = 'group assistant removed!'
            // logger the redux action
            logAppStateService.log('REMOVE GROUP ASSISTANT BY PI', preState, nextState, message);
            alertService.success('Remove Group Assistant Succeeded!', true);
        },
        (error) => {
            // get state: apppartialstate
            const preState: AppPartialState = logAppStateService.getAppPartialState();
            const nextState: AppPartialState = preState;
            const message: string = 'remove group assistant failed: ' + (error || 'server error!') ;
            logAppStateService.log('REMVOE GROUP ASSISTANT BY PI', preState, nextState, message);
            console.log(error);
            // error
            alertService.error('Remove Group Assistant Failed!');
        })
}

// remove researcher to one group
export const removeMemberAsync =
(group_pk: number, user_pk: number, groupService: GroupService, alertService: AlertService, logAppStateService: LogAppStateService) =>
(dispatch: Dispatch<AppState>, getState) => {
    groupService.removeMember(group_pk, user_pk)
    .subscribe(
        (data: any) => {
            // get state: apppartialstate
            const preState: AppPartialState = logAppStateService.getAppPartialState();
            // dispatch authGroup
            const setAuthGroupAction: SetAuthGroupAction = data.groups == null ?
                  setAuthGroupActionCreator(null) : setAuthGroupActionCreator((<Array<Group>>data.groups));
            dispatch(setAuthGroupAction);

            // get state: apppartialstate
            const nextState: AppPartialState = logAppStateService.getAppPartialState();
            const message = 'group member removed!'
            // logger the redux action
            logAppStateService.log('REMOVE GROUP MEMBER BY PI', preState, nextState, message);
            alertService.success('Remove Group Member Succeeded!', true);
        },
        (error) => {
            // get state: apppartialstate
            const preState: AppPartialState = logAppStateService.getAppPartialState();
            const nextState: AppPartialState = preState;
            const message: string = 'remove group member failed: ' + (error || 'server error!') ;
            logAppStateService.log('REMVOE GROUP MEMEBER BY PI', preState, nextState, message);
            console.log(error);
            alertService.error('Remove Group Memeber Failed!');
        })
}
