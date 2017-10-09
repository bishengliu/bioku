import { Action, ActionCreator, Dispatch } from 'redux';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { REDUX_CONSTANTS as C } from '../root/constants';
import { AppState, AppPartialState } from '../root/state';
import { AlertService } from '../../_services/AlertService';
import { LogAppStateService } from '../../_services/LogAppStateService';
import { RefreshService } from '../../_services/RefreshService';
import {LoggerAction, loggerActionCreator} from '../logger/logger_actions';
import { ContainerService } from '../../_services/ContainerService';

import { Box } from '../../_classes/Box';
import { Container } from '../../_classes/Container';

//import { AuthState } from '../account/account_state';
import { ContainerState } from '../container/container_state';
//query my container list
//with thunk

//SET_AUTH_INFO
export interface SetContainerInfoAction extends Action {
    containerState: ContainerState;
}

export const SetContainerInfoActionCreator: ActionCreator<SetContainerInfoAction> = 
(containerState: ContainerState) => ({
    type: C.SET_CONTAINER_INFO,
    containerState: containerState
});

//set MY containers
export interface SetMyContainersAction extends Action {
    containers: Array<Container>;
}
export const setMyContainersActionCreator: ActionCreator<SetMyContainersAction> = 
(containers: Array<Container>) => ({
    type: C.SET_MYCONTAINERS_LIST,
    containers: containers
});

//unset MY containers
export const unSetMyContainersActionCreator: ActionCreator<Action> = 
() => ({
    type: C.UNSET_MYCONTAINERS_LIST,
});

//set current container
export interface SetCurrentContainerAction extends Action {
    currentContainer: Container;
}
export const setCurrentContainerActionCreator: ActionCreator<SetCurrentContainerAction> = 
(container: Container) => ({
    type: C.SET_CURRENT_CONTAINER,
    currentContainer: container
});

//unset
export const unSetCurrentContainerActionCreator: ActionCreator<Action> =
()=>({
    type: C.UNSET_CURRENT_CONTAINER
})

//set selected box of a container
export interface SetCurrentBoxAction extends Action {
    currentContainer: Container;
    currentBox: Box;
}
export const setCurrentBoxActionCreator: ActionCreator<SetCurrentBoxAction> = 
(container: Container, box: Box) => ({
    type: C.SET_CURRENT_BOX,
    currentContainer: container,
    currentBox: box
});

//unset selected box of a container
export interface UnSetCurrentBoxAction extends Action {
    currentContainer: Container;
}

export const unSetCurrentBoxActionCreator: ActionCreator<UnSetCurrentBoxAction> = 
(container: Container) => ({
    type: C.UNSET_CURRENT_BOX,
    currentContainer: container
});


export const setCurrentContainerActionAsync = (container: Container, refreshService: RefreshService) =>
(dispatch: Dispatch<AppState>, getState)=>{
    Observable.of(container)
    .subscribe(
        (data: Container)=>{
            let setCurrentContainerAction: SetCurrentContainerAction = setCurrentContainerActionCreator(data);
            dispatch(setCurrentContainerAction);
            //dumpdata to the locastorage
            refreshService.dumpContainerState(getState().containerInfo);
        }
    );
}

export const setMyContainersActionAsync = 
(containerService: ContainerService, alertService: AlertService, logAppStateService: LogAppStateService, refreshService: RefreshService) =>
(dispatch: Dispatch<AppState>, getState) =>
{
    containerService.myContainers()
    .subscribe(
        data =>{
            //console.log(data);
            //get state: apppartialstate
            let preState: AppPartialState = logAppStateService.getAppPartialState();
            //set my containers list
            let setMyContainersAction: SetMyContainersAction = setMyContainersActionCreator(data);
            dispatch(setMyContainersAction);
            //dumpdata to the locastorage
            refreshService.dumpContainerState(getState().containerInfo);
            //get state: apppartialstate
            let nextState: AppPartialState = logAppStateService.getAppPartialState();
            let message: string = 'query my containers success!';
            //logger the redux action
            logAppStateService.log('GET MY CONTAINERS', preState, nextState, message);
        },
        (err)=>{
            console.log(err);
            refreshService.cleanContainerState();
            alertService.error('Failed to get containers from server, please try again later!');
        }
    );
}

export const setCurrentBoxActionAsync =
(containerService: ContainerService, logAppStateService: LogAppStateService, container: Container, box: Box) =>
(dispatch: Dispatch<AppState>, getState) =>
{
    containerService.getContainerBox(container.pk, box.box_position)
    .subscribe( data =>{
            //get state: apppartialstate
            let preState: AppPartialState = logAppStateService.getAppPartialState();
            //set current box
            let setCurrentBoxAction : SetCurrentBoxAction = setCurrentBoxActionCreator(container, box);
            dispatch(setCurrentBoxAction);  

            //get state: apppartialstate
            let nextState: AppPartialState = logAppStateService.getAppPartialState();
            let message: string = 'set current box!';
            //logger the redux action
            logAppStateService.log('SET CURRENT BOX', preState, nextState, message);
        },
        (err) => console.log(err)
    );
}