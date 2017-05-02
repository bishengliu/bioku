//get user token and detail by posting username and password
import { Injectable , Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';

@Injectable()
export class RegisterService{
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any){}
    registerUser(formData: FormData){        
        //url for get auth user details
        const register_url: string  = this.appSetting.URL + this.appSetting.REGISTER_USER;
        //url to get my groups info
        const auth_groups: string = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
        //get auth user
        const user_detail: string  = this.appSetting.URL + this.appSetting.AUTH_USER;
        return this.http.post(register_url, formData) //do provide header accorrding to django
                   .map((response: Response) =>response.json())
                   //get the authUser using mergeMap
                   .mergeMap(data=>{
                       if (!data && !data.detail){
                            return Observable.throw('Registration Failed!');
                        }
                       let detail = data.detail;
                       let token = data.token;
                       let user_pk = data.user;
                       let token_obj = {'token': token, 'user': user_pk};
                       if (!token || !user_pk){
                            return data; };
                       //get the auth user

                       let headers = new Headers({ 'Authorization': 'Token '+ token });
                       let options = new RequestOptions({ headers: headers });                       
                       //return the new obserable
                       return this.http.get(user_detail, options)
                            .map((response: Response) =>response.json())
                            .map((user_obj: any) => {
                                return {'user': user_obj, 'token': token_obj, 'detail': detail}; //combined object
                            })
                            .catch((error:any) => Observable.of({'token': token_obj, 'detail': detail}));
                   })
                    .mergeMap((data:any) =>{
                        //console.log(data);
                        //further to get user details
                        let token = data.token.token;
                        let headers = new Headers({ 'Authorization': 'Token '+ token });
                        let options = new RequestOptions({ headers: headers });
                        return this.http.get(auth_groups, options)
                            .map((response: Response) =>response.json())
                            //.toArray()
                            //.do((res:any)=>{console.log(res)})
                            .map((res:any) => {
                                    return Object.assign({}, data, {'groups': res});
                            })
                            .catch((error: any) => {
                                    console.log(error)
                                    return Observable.of(Object.assign({}, data, {'groups': null}));
                            });
                    })
                   //.do(data=>{console.log(data)})
                   .catch((error:any) => Observable.throw(error));
    }
}