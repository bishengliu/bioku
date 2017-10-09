//get user token and detail by posting username and password
import { Injectable , Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting } from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';

@Injectable()
export class LoginService{
    
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any){}

    //login user to get token and user details
    authUser(username: string, password: string){
        //url to get token for authentication
        const token_url: string = this.appSetting.URL + this.appSetting.TOKEN_URL;
        //url for get auth user details
        const user_detail: string  = this.appSetting.URL + this.appSetting.AUTH_USER;
        //url to get my groups info
        const auth_groups: string = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
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
                    return Observable.throw('Fail to login!');
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
            //.do(data=>{console.log(data)})
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
            //mergeMap to return
            // {'user': data.user, 'token': data.token, 'groups': group_obj}
            //.do(data=>{console.log(data)})         
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
}