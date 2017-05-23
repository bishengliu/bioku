
import {FormControl, Validators} from '@angular/forms';
import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CustomFormValidators{
    constructor(private http:Http,  @Inject(APP_CONFIG) private appSetting: any){}

    private validTimeout;

    //sync validators, 2nd parameter
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
            if(control.touched && !control.value.match(telephone_pattern)){
                return { telephoneInvalid: true}
            }
            else{
                return null;
            }
        }
    }
    digitValidator(){
        return (control: FormControl): {[s: string]: Boolean} => 
        {
            if(!control.value || control.value.length === 0 || control.value ==""){
                return null;
            }
            let digit_pattern = new RegExp("^([0-9]){1,}$");
            if(control.touched && !control.value.match(digit_pattern)){
                return { digitInvalid: true}
            }
            else{
                return null;
            }
        }
    }
    //async validators, must be the 3rd parameter
    //async validation
    usernameAsyncValidator(){
        return (control: FormControl): Observable<{[key : string] : Boolean}> => {
                //not reuired
                if(!control.value || control.value.length === 0 || control.value ==""){
                    return Observable.throw(null);
                };
                
                return new Observable(observer=>{
                    const find_user_detail_url: string  = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
                    let body: string = JSON.stringify({'query': 'username', 'value': control.value});
                    let headers = new Headers({ 'Content-Type': 'application/json' });
                    let options = new RequestOptions({ headers: headers });

                    control.valueChanges
                        .debounceTime(1000)
                        .flatMap(value => this.http.post(find_user_detail_url, body, options))
                        .map((response: Response) =>response.json())
                        .catch((error:any) => { 
                            observer.next({usernameAsyncInvalid: true });
                            observer.complete();
                            return Observable.throw({usernameAsyncInvalid: true });      
                        })
                        .subscribe(data=>{
                            if (data && <Boolean>data.matched){
                                observer.next({usernameAsyncInvalid: true });
                                observer.complete();} 
                            else{
                                observer.next(null);
                                observer.complete();}
                          },
                          ()=>{observer.next({usernameAsyncInvalid: true });
                                observer.complete();
                          });   //end subscribe               
                }); //end new Observable 
            };
    };               
    //async email
    emailAsyncValidator(user_pk: Number = -1){
        return (control: FormControl): Observable<{[key : string] : Boolean}> => {
                //not reuired
                if(!control.value || control.value.length === 0 || control.value ==""){
                    return Observable.throw(null);
                }

                return new Observable(observer=>{
                    const find_user_detail_url: string  = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
                    let body: string = JSON.stringify({'query': 'email', 'value': control.value, 'user_pk': user_pk});
                    let headers = new Headers({ 'Content-Type': 'application/json' });
                    let options = new RequestOptions({ headers: headers });
                    if (!control.dirty){
                        observer.next(null);
                        observer.complete();
                    }
                    else {
                        control.valueChanges
                        .debounceTime(1000)
                        .flatMap(value => this.http.post(find_user_detail_url, body, options))
                        .map((response: Response) =>response.json())
                        .catch((error:any) => { 
                            observer.next({ emailAsyncInvalid: true });
                            observer.complete();
                            return Observable.throw({ emailAsyncInvalid: true });      
                        })
                        .subscribe(data=>{
                            if (data && <Boolean>data.matched){
                                observer.next({ emailAsyncInvalid: true });
                                observer.complete();} 
                            else{
                                observer.next(null);
                                observer.complete();}
                          },
                          ()=>{observer.next({ emailAsyncInvalid: true });
                                observer.complete();
                          });   //end subscribe    
                    }           
                }); //end new Observable 
            };
    };

    //async validator passworkd
    currentPasswordAsyncValidator(appStore){
        return (control: FormControl): Observable<{[key : string] : Boolean}> =>{
            //required
            return new Observable(observer => {
                //url to get token for authentication
                const token_url: string = this.appSetting.URL + this.appSetting.TOKEN_URL;
                let username = (appStore.getState().authInfo && appStore.getState().authInfo.authUser) ? appStore.getState().authInfo.authUser.username: '';
                let body: string = JSON.stringify({'username': username, 'password': control.value});
                //let body = {'username': username, 'password': password};
                let headers = new Headers({ 'Content-Type': 'application/json' });
                let options = new RequestOptions({ headers: headers });
                control.valueChanges
                        .debounceTime(2000)
                        .flatMap(value => this.http.post(token_url, body, options))
                        .map((response: Response) =>response.json())
                        .catch((error:any) => { 
                            observer.next({ currentPasswordAsyncInvalid: true });
                            observer.complete();
                            return Observable.throw({ currentPasswordAsyncInvalid: true });      
                        })
                        .subscribe(data=>{
                            if(data && data.token){
                                //old password is corrent
                                observer.next(null);
                                observer.complete();
                            }
                            else{
                                observer.next({ currentPasswordAsyncInvalid: true });
                                observer.complete();
                            }
                        },
                        ()=>{
                            observer.next({ currentPasswordAsyncInvalid: true });
                            observer.complete();
                          }
                        );
            })
        }
    }
    //async validate research group name

    groupnameAsyncValidator(group_pk: Number = -1){
        return (control: FormControl): Observable<{[key : string] : Boolean}> =>{
            //not reuired
            if(!control.value || control.value.length === 0 || control.value ==""){
                return Observable.throw(null);
            }
            return new Observable(observer=>{
                const find_group_detail_url: string  = this.appSetting.URL + this.appSetting.FIND_GROUP_DETAILS;
                let body: string = JSON.stringify({'query': 'group_name', 'value': control.value, 'group_pk': group_pk});
                let headers = new Headers({ 'Content-Type': 'application/json' });
                let options = new RequestOptions({ headers: headers });
                if (!control.dirty){
                        observer.next(null);
                        observer.complete();
                }
                else
                {
                    control.valueChanges
                        .debounceTime(1000)
                        .flatMap(value => this.http.post(find_group_detail_url, body, options))
                        .map((response: Response) =>response.json())
                        .catch((error:any) => { 
                            observer.next({ groupnameAsyncInvalid: true });
                            observer.complete();
                            return Observable.throw({ groupnameAsyncInvalid: true });      
                        })
                        .subscribe(data=>{
                            if (data && <Boolean>data.matched){
                                observer.next({ groupnameAsyncInvalid: true });
                                observer.complete();} 
                            else{
                                observer.next(null);
                                observer.complete();}
                          },
                          ()=>{observer.next({ groupnameAsyncInvalid: true });
                                observer.complete();
                          });   //end subscribe 
                }
            });
        }        
    }
    containernameAsyncValidator(container_pk: number = -1){
        return (control: FormControl): Observable<{[key : string] : Boolean}> =>{
            //not reuired
            if(!control.value || control.value.length === 0 || control.value ==""){
                return Observable.throw(null);
            }
            return new Observable(observer=>{
                const find_container_detail_url: string  = this.appSetting.URL + this.appSetting.FIND_CONTAINER_DETAILS;
                let body: string = JSON.stringify({'query': 'name', 'value': control.value, 'container_pk': container_pk});
                let headers = new Headers({ 'Content-Type': 'application/json' });
                let options = new RequestOptions({ headers: headers });
                if (!control.dirty){
                        observer.next(null);
                        observer.complete();
                }
                else
                {
                    control.valueChanges
                        .debounceTime(1000)
                        .flatMap(value => this.http.post(find_container_detail_url, body, options))
                        .map((response: Response) =>response.json())
                        .catch((error:any) => { 
                            observer.next({ containernameAsyncInvalid: true });
                            observer.complete();
                            return Observable.throw({ containernameAsyncInvalid: true });      
                        })
                        .subscribe(data=>{
                            if (data && <Boolean>data.matched){
                                observer.next({ containernameAsyncInvalid: true });
                                observer.complete();} 
                            else{
                                observer.next(null);
                                observer.complete();}
                          },
                          ()=>{observer.next({ containernameAsyncInvalid: true });
                                observer.complete();
                          });   //end subscribe 
                }
            });
        }
    }

    //async email
    groupemailAsyncValidator(group_pk: Number = -1){
        return (control: FormControl): Observable<{[key : string] : Boolean}> => {
                //not reuired
                if(!control.value || control.value.length === 0 || control.value ==""){
                    return Observable.throw(null);
                }

                return new Observable(observer=>{
                    const find_group_detail_url: string  = this.appSetting.URL + this.appSetting.FIND_GROUP_DETAILS;
                    let body: string = JSON.stringify({'query': 'email', 'value': control.value, 'group_pk': group_pk});
                    let headers = new Headers({ 'Content-Type': 'application/json' });
                    let options = new RequestOptions({ headers: headers });
                    if (!control.dirty){
                        observer.next(null);
                        observer.complete();
                    }
                    else {
                        control.valueChanges
                        .debounceTime(1000)
                        .flatMap(value => this.http.post(find_group_detail_url, body, options))
                        .map((response: Response) =>response.json())
                        .catch((error:any) => { 
                            observer.next({ emailAsyncInvalid: true });
                            observer.complete();
                            return Observable.throw({ emailAsyncInvalid: true });      
                        })
                        .subscribe(data=>{
                            if (data && <Boolean>data.matched){
                                observer.next({ emailAsyncInvalid: true });
                                observer.complete();} 
                            else{
                                observer.next(null);
                                observer.complete();}
                          },
                          ()=>{observer.next({ emailAsyncInvalid: true });
                                observer.complete();
                          });   //end subscribe    
                    }           
                }); //end new Observable 
            };
    };
}

