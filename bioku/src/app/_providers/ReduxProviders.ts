import {InjectionToken} from '@angular/core';
//provider token
export const AppStore = new InjectionToken<any>("app.store");
//auth store instance to be injected
import {appStore} from '../_redux/root/store';
//interface is not used for di, which is not available at runtime
// use InjectionToken

export const StoreProviders: Array<any> = [
    { provide: AppStore, useValue: appStore },   
];

