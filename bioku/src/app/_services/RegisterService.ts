//get user token and detail by posting username and password
import { Injectable , Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import {APP_CONFIG} from '../_providers/AppSettingProvider';

@Injectable()
export class RegisterService{
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any){}
    registerUser(formData: FormData){        
        //url for get auth user details
        const register_url: string  = this.appSetting.URL + this.appSetting.REGISTER_USER;       
        return this.http.post(register_url, formData) //do provide header accorrding to django
                   .map((response: Response) =>response.json())
                   //get the authUser using mergeMap
                   .mergeMap(data=>{
                       let detail = data.detail;
                       let token = data.token;
                       let user_pk = data.user;
                       let token_obj = {'token': token, 'user': user_pk};
                       if (!token || !user_pk){
                            return data; };
                       //get the auth user

                       let headers = new Headers({ 'Authorization': 'Token '+ token });
                       let options = new RequestOptions({ headers: headers });
                       const user_detail: string  = this.appSetting.URL + this.appSetting.AUTH_USER;
                       //return the new obserable
                       return this.http.get(user_detail, options)
                            .map((response: Response) =>response.json())
                            .map((user_obj: any) => {
                                return {'user': user_obj, 'token': token_obj, 'detail': detail}; //combined object
                            })
                            .catch((error:any) => Observable.of({'token': token_obj, 'detail': detail}));
                   })
                   .do(data=>{console.log(data)})
                   .catch((error:any) => Observable.throw(error));
    }
}