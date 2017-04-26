//get user token and detail by posting username and password
import { Injectable , Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import {APP_CONFIG} from '../_providers/AppSettingProvider';

@Injectable()
export class LoginService{
    
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any){}

    //login user to get token and user details
    authUser(username: string, password: string){
        //url to get token for authentication
        const token_url: string = this.appSetting.URL + this.appSetting.TOKEN_URL;
        //url for get auth user details
        const user_detail: string  = this.appSetting.URL + this.appSetting.AUTH_USER;
        let body: string = JSON.stringify({'username': username, 'password': password});
        //let body = {'username': username, 'password': password};
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(token_url, body, options)
            .map((response: Response) =>response.json())
            //.do(data=>{console.log(data)}) //token object
            //merge obserable to further request user info
            .mergeMap( (token_obj: any) => {
                //token_obj = {'token': '', 'user': 1}
                if (!token_obj && !token_obj.token){
                    return Observable.empty();
                }
                //further to get user details
                let token = token_obj.token;
                let headers = new Headers({ 'Authorization': 'Token '+ token });
                let options = new RequestOptions({ headers: headers });
                //return the new obserable
                return this.http.get(user_detail, options)
                            .map((response: Response) =>response.json())
                            //.do(user_obj=>{console.log(user_obj)})  //user object
                            .map((user_obj: any) => {
                                return {'user': user_obj, 'token': token_obj}; //combined object
                            });
            })
            //mergeMap to return
            // {'user': data.user, 'token': data.token, 'group': group_obj}
            //.do(data=>{console.log(data)})         
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}