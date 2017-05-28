import { Action, ActionCreator, Dispatch } from 'redux';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { REDUX_CONSTANTS as C } from '../root/constants';
import { AppState, AppPartialState } from '../root/state';
import { AlertService } from '../../_services/AlertService';
import { LogAppStateService } from '../../_services/LogAppStateService';

import {LoggerAction, loggerActionCreator} from '../logger/logger_actions';
import { ContainerService } from '../../_services/ContainerService';

import { Box } from '../../_classes/Box';
import { Container } from '../../_classes/Container';
//query my container list
//with thunk

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

export const setMyContainersActionAsync = 
(containerService: ContainerService, alertService: AlertService, logAppStateService: LogAppStateService) =>
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
            
            //get state: apppartialstate
            let nextState: AppPartialState = logAppStateService.getAppPartialState();
            let message: string = 'query my containers success!';
            //logger the redux action
            logAppStateService.log('GET MY CONTAINERS', preState, nextState, message);
        },
        (err)=>{
            console.log(err);
            alertService.error('GET MY CONTAINERS FAILED!');
        }
    );
}