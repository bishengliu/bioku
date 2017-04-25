//get user token and detail by posting username and password
import { Injectable , Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import {APP_CONFIG} from '../_providers/AppSettingProvider';

@Injectable()
export class RegisterService{
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any){}
    registerUser(values){
        let obj = {
            username : values.username,
            email : values.email,
            password1 : values.password1,
            password2 : values.password2,
            first_name : values.first_name,
            last_name : values.last_name,
            //birth_date : '2017-05-01',
            birth_date : values.birth_date.date.year + '-'+ values.birth_date.date.month + '-'+ values.birth_date.date.day,
            telephone : values.telephone };
        //url for get auth user details
        const register_url: string  = this.appSetting.URL + this.appSetting.REGISTER_USER;
        let body: string = JSON.stringify(obj);
        //let body = {'username': username, 'password': password};
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(register_url, body, options)
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
                   .catch((error:any) => Observable.throw('Server error'));
    }
}