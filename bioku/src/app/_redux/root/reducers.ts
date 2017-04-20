import {combineReducers, Reducer} from 'redux';
import {AppState} from './state';
import { AuthState } from '../login/login_state';
import {authReducer} from '../login/login_reducers';



export const rootReducer: Reducer<AppState> = combineReducers<AppState>({ authInfo: authReducer })