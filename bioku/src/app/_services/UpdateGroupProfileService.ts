import { Injectable , Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
//redux
import { AppStore } from '../_providers/ReduxProviders';
@Injectable()
export class UpdateGroupProfileService{
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore){}

    update(formData: FormData, pk: number){
        let state = this.appStore.getState();
        let token = state.authInfo.token.token;
        let headers = new Headers({ 'Authorization': 'Token '+ token });
        let options = new RequestOptions({ headers: headers });

        //url for get auth user details
        const update_profile_url: string  = this.appSetting.URL + this.appSetting.UPDATE_GROUP_INFO;
        let auth_groups = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
        if(!state || !token || !state.authInfo || !state.authInfo.authUser){
            return Observable.throw('Please first login');
        }
        if(state.authInfo.authUser.roles.indexOf('PI') === -1){
            return Observable.throw('Please login as PI');
        }
        return this.http.put(update_profile_url, formData, options) //do provide header accorrding to django
                   .map((response: Response) =>response.json())
                   //further get authGroup info
                    .mergeMap(() =>{                
                        return this.http.get(auth_groups, options)
                            .map((response: Response) =>response.json())                       
                            .map((res:any) => {
                                    return Object.assign({}, {'groups': res});
                            })
                            .catch((error: any) => {
                                    console.log(error)
                                    return Observable.of(Object.assign({}, {'groups': null}));
                            });
                    })            
                    .catch((error:any) => Observable.throw(error || 'Server error'));
    }
}