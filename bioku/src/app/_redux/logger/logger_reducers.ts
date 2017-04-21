import {REDUX_CONSTANTS as C } from '../root/constants';
import {AppLog} from '../../_classes/Logger';
import { initialAppState } from '../root/state';
import { Action, Reducer } from 'redux';
import {LoggerAction} from './logger_actions';
//log state is Array<AppLog>
const initialLogState: Array<AppLog> = initialAppState.appLogs;

export const loggerReducer: Reducer<Array<AppLog>> = 
function (state: Array<AppLog> = initialLogState, action: Action): Array<AppLog> {
    switch(action.type){
        case C.LOG_APP_STATE:
            let logInfo = <LoggerAction>action;
            let nState = state.slice();
            let nLog: AppLog = {
                action: logInfo.action,
                timestamp: logInfo.timestamp,
                preState: logInfo.preState,
                nextState: logInfo.nextState,
                message: logInfo.message
            }
            nState.push(nLog); //add to the list
            return nState;
            
        default:
            return state;
    }
}