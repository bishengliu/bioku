import { Store, createStore, StoreEnhancer, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { AppState } from './state';
import { rootReducer } from './reducers';

//using redux devtools for chrome
const devtools: StoreEnhancer<AppState> = window['devToolsExtension'] ? window['devToolsExtension']() : f => f;

export const appStore: Store<AppState> = createStore<any>(rootReducer, devtools, applyMiddleware(thunk));
