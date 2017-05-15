import { Injectable , Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import {APP_CONFIG} from '../_providers/AppSettingProvider';
//redux
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class GroupService{
    
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore){}

    addAssistant(group_pk: number, email: string){
        let state = this.appStore.getState();
        let token = state.authInfo.token.token;
        let headers = new Headers({ 'Authorization': 'Token '+ token, 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let auth_groups = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
        let find_user = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
        if(!state || !token || !state.authInfo || !state.authInfo.authUser){
            return Observable.throw('Please first login');
        }
        if(state.authInfo.authUser.roles.indexOf('PI') === -1){
            return Observable.throw('Please login as PI');
        }
        //url(r'^(?P<pk>[0-9]+)/assistants/$', OneGroupAssistantList.as_view(), name='one-group-assistant-list'),
        const add_assistant_url: string= this.appSetting.URL + this.appSetting.SINGLE_GROUP_API + group_pk + '/assistants/';
        let body: string = JSON.stringify({'query': 'email', 'value': email});
        return this.http.post(find_user, body, options)
                    .map((response: Response) =>response.json())
                    .do((data:any)=>{console.log(data)})
                    .mergeMap((data:any)=>{
                        let body2: string = JSON.stringify({'group_id': group_pk, 'user_id': data.user.pk});
                        return this.http.post(add_assistant_url, body2, options)
                                    .map((response: Response) =>response.json());
                    })
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

    addMember(group_pk: number, email: string){
        let state = this.appStore.getState();
        let token = state.authInfo.token.token;
        let headers = new Headers({ 'Authorization': 'Token '+ token, 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let auth_groups = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
        let find_user = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;

        if(!state || !token || !state.authInfo || !state.authInfo.authUser){
            return Observable.throw('Please first login');
        }
        if(state.authInfo.authUser.roles.indexOf('PI') === -1){
            return Observable.throw('Please login as PI');
        }
        //url(r'^(?P<pk>[0-9]+)/researchers/$', OneGroupResearcherList.as_view(), name='one-group-researcher-list'),
        const add_member_url: string= this.appSetting.URL + this.appSetting.SINGLE_GROUP_API + group_pk + '/researchers/';
        let body: string = JSON.stringify({'query': 'email', 'value': email});
        return this.http.post(find_user, body, options)
                    .map((response: Response) =>response.json())
                    .mergeMap((data:any)=>{
                        let body2: string = JSON.stringify({'group_id': group_pk, 'user_id': data.user.pk});
                        return this.http.post(add_member_url, body2, options)
                                    .map((response: Response) =>response.json());
                    })
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

    removeAssistant(group_pk: number, user_pk: number){
        let state = this.appStore.getState();
        let token = state.authInfo.token.token;
        let headers = new Headers({ 'Authorization': 'Token '+ token, 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let auth_groups = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
        let find_user = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
        if(!state || !token || !state.authInfo || !state.authInfo.authUser){
            return Observable.throw('Please first login');
        }
        if(state.authInfo.authUser.roles.indexOf('PI') === -1){
            return Observable.throw('Please login as PI');
        }
        //url(r'^(?P<g_id>[0-9]+)/assistants/(?P<u_id>[0-9]+)/$', OneGroupAssistantDetail.as_view(), name='one-group-assistant-detail'),
        const remove_assistant_url: string= this.appSetting.URL + this.appSetting.SINGLE_GROUP_API + group_pk + '/assistants/'+ user_pk +'/';
        return this.http.delete(remove_assistant_url, options)
                .map((response: Response) =>response.json())
                //further get authGroup info
                .mergeMap(() =>{                
                    return this.http.get(auth_groups, options)
                        .map((response: Response) =>response.json())                       
                        .map((res:any) => {
                                return Object.assign({},  {'groups': res});
                        })
                        .catch((error: any) => {
                                console.log(error)
                                return Observable.of(Object.assign({}, {'groups': null}));
                        });
                })            
                .catch((error:any) => Observable.throw(error || 'Server error')); 
    }
    removeMember(group_pk: number, user_pk: number){
        let state = this.appStore.getState();
        let token = state.authInfo.token.token;
        let headers = new Headers({ 'Authorization': 'Token '+ token, 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let auth_groups = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
        let find_user = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;

        if(!state || !token || !state.authInfo || !state.authInfo.authUser){
            return Observable.throw('Please first login');
        }
        if(state.authInfo.authUser.roles.indexOf('PI') === -1){
            return Observable.throw('Please login as PI');
        }
        //url(r'^(?P<g_id>[0-9]+)/researchers/(?P<u_id>[0-9]+)/$', OneGroupResearcherDetail.as_view(), name='one-group-researcher-detail'),
        const remove_member_url: string= this.appSetting.URL + this.appSetting.SINGLE_GROUP_API + group_pk + '/researchers/'+ user_pk +'/';
        return this.http.delete(remove_member_url, options)
                .map((response: Response) =>response.json())
                //further get authGroup info
                .mergeMap(() =>{                
                    return this.http.get(auth_groups, options)
                        .map((response: Response) =>response.json())                       
                        .map((res:any) => {
                                return Object.assign({},  {'groups': res});
                        })
                        .catch((error: any) => {
                                console.log(error)
                                return Observable.of(Object.assign({}, {'groups': null}));
                        });
                })            
                .catch((error:any) => Observable.throw(error || 'Server error')); 
    }

    //get the list of all researcher groups
    getAllGroups(){
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
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_GROUPS;
        return this.http.get(query_url, options)
            .map((response: Response) =>response.json())
            //.do(data=>console.log(data))
            .catch((error:any) => Observable.throw(error || 'Server error')); 
    }

    //get group count
    getGroupCount(){
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
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_GROUPS+ 'count/';
        return this.http.get(query_url, options)
        .map((response: Response) =>response.json())
            //.do(data=>console.log(data))
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    //create group
    create(formData: FormData){
        let state = this.appStore.getState();
        let token = state.authInfo.token.token;
        let headers = new Headers({ 'Authorization': 'Token '+ token });
        let options = new RequestOptions({ headers: headers });

        if(!state || !token || !state.authInfo || !state.authInfo.authUser){
            return Observable.throw('Please first login');
        }
        if(!state.authInfo.authUser.is_superuser){
            return Observable.throw('Please login as Admin');
        }
        const create_group_url: string  = this.appSetting.URL + this.appSetting.ALL_GROUPS;
        return this.http.put(create_group_url, formData, options) //do provide header accorrding to django
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
}