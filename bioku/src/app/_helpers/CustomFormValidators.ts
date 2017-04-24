
import {FormControl, Validators} from '@angular/forms';
import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
import { Observable } from 'rxjs';

@Injectable()
export class CustomFormValidators{
    constructor(private http:Http,  @Inject(APP_CONFIG) private appSetting: any){}

    private validTimeout;

    //validator username
    usernameValidator() {
        return (control: FormControl): {[s: string]: Boolean} => 
        {
            //not reuired
            if(!control.value || control.value.length === 0 || control.value ==""){
                return null
            }
            //let username_pattern = new RegExp("^([a-zA-Z]+[0-9_-]*){6,}$");
            if(!control.value.match(/^([a-zA-Z]+[0-9_-]*){6,}$/)){
                return {usernameInvalid: true}
            }
        }
    }
    //async validation
    usernameAsyncValidator(){
        return (control: FormControl): {[s: string]: Boolean} => {
                //not reuired
                if(!control.value || control.value.length === 0 || control.value ==""){
                    return null;
                }
                 new Observable((obs: any) =>{
                    control
                    .valueChanges
                    .debounceTime(400)
                    .flatMap(value =>{
                        const find_user_detail_url: string  = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
                        let body: string = JSON.stringify({'query': 'username', 'value': control.value});
                        let headers = new Headers({ 'Content-Type': 'application/json' });
                        let options = new RequestOptions({ headers: headers });
                        return this.http.post(find_user_detail_url, body, options)})
                    .map((response: Response) =>response.json())
                    .map(data=>{ return { usernameAsyncInvalid: <Boolean>data.matched }; })
                    .catch((error:any) => Observable.throw({ usernameAsyncInvalid: true }))
                    .subscribe(
                            (data: {[s: string]: Boolean}) => data),
                            ()=>{ 
                                obs.next({ usernameAsyncInvalid: true });
                                obs.complete();
                            };
                })
                
                https://auth0.com/blog/angular2-series-forms-and-custom-validation/
                /*
                clearTimeout(this.validTimeout);
                this.validTimeout = setTimeout(()=>{
                    const find_user_detail_url: string  = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
                    let body: string = JSON.stringify({'query': 'username', 'value': control.value});
                    let headers = new Headers({ 'Content-Type': 'application/json' });
                    let options = new RequestOptions({ headers: headers });
                    this.http.post(find_user_detail_url, body, options)
                        .map((response: Response) =>response.json())
                        .catch((error:any) => Observable.throw({ usernameAsyncInvalid: true }))                  
                        .subscribe(
                            (data: {[s: string]: Boolean}) => { return { usernameAsyncInvalid: data.matched }; },
                            ()=>{ return { usernameAsyncInvalid: true }; });
                }, 2000); 
                */


            };
        };
    //async email
    emailAsyncValidator(){
        return (control: FormControl): {[s: string]: Boolean} => {
                //not reuired
                if(!control.value || control.value.length === 0 || control.value ==""){
                    return null;
                }
                clearTimeout(this.validTimeout);
                this.validTimeout = setTimeout(()=>{
                    const find_user_detail_url: string  = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
                    let body: string = JSON.stringify({'query': 'email', 'value': control.value});
                    let headers = new Headers({ 'Content-Type': 'application/json' });
                    let options = new RequestOptions({ headers: headers });
                    this.http.post(find_user_detail_url, body, options)
                        .map((response: Response) =>response.json())
                        .catch((error:any) => Observable.throw({ emailAsyncInvalid: true }))                  
                        .subscribe(
                            (data: {[s: string]: Boolean}) => { return { emailAsyncInvalid: data.matched }; },
                            ()=>{ return { emailAsyncInvalid: true }; });
                }, 2000);                                  
            };
        };
    //validate password
    passwordValidator(){
        return (control: FormControl): {[s: string]: Boolean}=>
        {
            //let password_pattern = new RegExp("^(?=.*[A-Z])(?=.*[a-z].*[a-z])(?=.*[0-9].*[0-9]).{8,}$");
            if(!control.value.match(/(?=.*[A-Z])(?=.*[a-z].*[a-z])(?=.*[0-9].*[0-9]).{8,}$/)){
                return { passwordInvalid: true}
            }
        }
    }

    //human_name
    humanNameValidator(){
        return (control: FormControl): {[s: string]: Boolean} => 
        {
            //not reuired
            if(!control.value || control.value.length === 0 || control.value ==""){
                return null
            }
            let human_name_pattern = new RegExp("^[a-zA-Z]+([a-zA-Z]+[0-9_\\-.\\s]*){1,}$");
            if(!control.value.match(human_name_pattern)){
                return { humanNameInvalid: true}
            }
        }
    }

    //filename
    filenameValidator(){
        return (control: FormControl): {[s: string]: Boolean} => 
        {
            //not reuired
            if(!control.value || control.value.length === 0 || control.value ==""){
                return null
            }
            let filename_pattern = new RegExp("^([a-zA-Z]+[0-9_\\-.\\s&%$#@()\\[\\]\\|\\^]*){4,}$");
            if(!control.value.match(filename_pattern)){
                return { filenameInvalid: true}
            }
        }
    }
    

    //telephone, need to be improved
    telephoneValidator(){
        return (control: FormControl): {[s: string]: Boolean} => 
        {
            if(!control.value || control.value.length === 0 || control.value ==""){
                return null
            }
            let telephone_pattern = new RegExp("^([0-9]){4,}$");
            if(!control.value.match(telephone_pattern)){
                return { telephoneInvalid: true}
            }
        }
    }
}

