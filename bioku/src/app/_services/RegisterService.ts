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
            //birth_date : values.birth_date.date,
            //birth_date : '2017-05-01',
            birth_date : values.birth_date.date.year + '-'+ values.birth_date.date.month + '-'+ values.birth_date.date.day,
            //photo : values.photo,
            telephone : values.telephone
        };
        //url for get auth user details
        const register_url: string  = this.appSetting.URL + this.appSetting.REGISTER_USER;
        let body: string = JSON.stringify(obj);
        //let body = {'username': username, 'password': password};
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(register_url, body, options)
                   .map((response: Response) =>response.json())
                   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}