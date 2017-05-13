import { Injectable , Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import {APP_CONFIG} from '../_providers/AppSettingProvider';
//redux
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class ContainerService{
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore){}
    
    //get container count
    getContainerCount(){
        let state = this.appStore.getState();
        let token = state.authInfo.token.token;
        let headers = new Headers({ 'Authorization': 'Token '+ token, 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        if(!state || !token || !state.authInfo || !state.authInfo.authUser){
            return Observable.throw('Please first login');
        }
        if(!state.authInfo.authUser.is_superuser){
            return Observable.throw('Please login as Admin');
        }
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS+ 'count/';
        return this.http.get(query_url, options)
        .map((response: Response) =>response.json())
        //.do(data=>console.log(data))
        .catch((error:any) => Observable.throw(error || 'Server error'));
    }
}

