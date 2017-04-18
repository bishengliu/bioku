import {InjectionToken} from '@angular/core';

//provider token
export let AuthStore = new InjectionToken<any>("login.store");
//auth store instance to be injected
import {authStore} from '../_redux/login/login_store';
//interface is not used for di, which is not available at runtime
//use InjectionToken
export let StoreProviders: Array<any> = [
    //login
    { provide: AuthStore, useValue: authStore }
];
