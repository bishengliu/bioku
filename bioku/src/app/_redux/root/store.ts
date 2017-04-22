import { createStore, StoreEnhancer, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { AppState } from './state';
import { rootReducer } from './reducers';

//using redux devtools for chrome 
const devtools: any = window['devToolsExtension'] ? window['devToolsExtension']() : f => f;

export const appStore = createStore<AppState>(rootReducer, devtools, applyMiddleware(thunk));
