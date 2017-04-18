import { Store, createStore, StoreEnhancer } from 'redux';
import { AuthStatus } from './login_state';
import { AuthReducer } from './login_reducers';

//using redux devtools for chrome
let  devtools: StoreEnhancer<AuthStatus> = window['devToolsExtension'] ? window['devToolsExtension']() : f => f;

export let authStore: Store<AuthStatus> = createStore<AuthStatus>(AuthReducer, devtools);
