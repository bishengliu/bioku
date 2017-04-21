import {REDUX_CONSTANTS as C } from '../root/constants';
import { Action, ActionCreator, Dispatch } from 'redux';

import { AppPartialState } from '../root/state';

export interface LoggerAction extends Action {  
    preState: AppPartialState;
    nextState: AppPartialState;
    message: string;
    timestamp: Date;
}

//action creator
export const loggerActionCreator: ActionCreator<LoggerAction> = 
    (preState: AppPartialState, nextState: AppPartialState, message: string) => ({
        type: C.LOG_APP_STATE,
        timestamp: new Date(),
        preState: preState,
        nextState: nextState,
        message: message
    });