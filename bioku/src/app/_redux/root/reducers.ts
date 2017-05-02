import {combineReducers, Reducer} from 'redux';
import {AppState} from './state';
import { AuthState } from '../account/account_state';
import {authReducer} from '../account/account_reducers';
import {loggerReducer} from '../logger/logger_reducers';


export const rootReducer: Reducer<AppState> = combineReducers<AppState>({ authInfo: authReducer,  appLogs: loggerReducer})