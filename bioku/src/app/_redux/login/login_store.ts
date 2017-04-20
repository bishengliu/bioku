/*
import { Store, createStore, StoreEnhancer, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { AuthState } from './login_state';
import { authReducer } from './login_reducers';

//using redux devtools for chrome
const devtools: StoreEnhancer<AuthState> = window['devToolsExtension'] ? window['devToolsExtension']() : f => f;

export const authStore: Store<AuthState> = createStore<any>(authReducer, devtools, applyMiddleware(thunk));
*/
