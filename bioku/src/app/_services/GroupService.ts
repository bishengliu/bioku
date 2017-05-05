import { Injectable , Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import {APP_CONFIG} from '../_providers/AppSettingProvider';
//redux
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class GroupService{
    
    token: string ='';
    state: any = null;
    headers = new Headers();
    options = new RequestOptions();
    auth_groups: string = '';
    find_user : string ='';
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore){
        this.state = this.appStore.getState();
        this.token = this.state.authInfo.token.token;
        this.headers = new Headers({ 'Authorization': 'Token '+ this.token, 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });

        this.auth_groups = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
        this.find_user = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
    }

    addAssistant(group_pk: number, email: string){
        debugger;
        if(!this.state || !this.token || !this.state.authInfo ){
            return Observable.throw('Please first login');
        }
        //url(r'^(?P<pk>[0-9]+)/assistants/$', OneGroupAssistantList.as_view(), name='one-group-assistant-list'),
        const add_assistant_url: string= this.appSetting.URL + this.appSetting.SINGLE_GROUP_API + group_pk + '/assistants/';
        let body: string = JSON.stringify({'query': 'email', 'value': email});
        return this.http.post(this.find_user, body, this.options)
                    .map((response: Response) =>response.json())
                    .mergeMap((data:any)=>{
                        let body2: string = JSON.stringify({'group_id': group_pk, 'user_id': data.user.pk});
                        return this.http.post(add_assistant_url, body2, this.options)
                                    .map((response: Response) =>response.json());
                    })
                    //further get authGroup info
                    .mergeMap(() =>{                
                        return this.http.get(this.auth_groups, this.options)
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
        if(!this.state || !this.token || !this.state.authInfo ){
            return Observable.throw('Please first login');
        }
        //url(r'^(?P<pk>[0-9]+)/researchers/$', OneGroupResearcherList.as_view(), name='one-group-researcher-list'),
        const add_member_url: string= this.appSetting.URL + this.appSetting.SINGLE_GROUP_API + group_pk + '/researchers/';
        let body: string = JSON.stringify({'query': 'email', 'value': email});
        return this.http.post(this.find_user, body, this.options)
                    .map((response: Response) =>response.json())
                    .mergeMap((data:any)=>{
                        let body2: string = JSON.stringify({'group_id': group_pk, 'user_id': data.user.pk});
                        return this.http.post(add_member_url, body2, this.options)
                                    .map((response: Response) =>response.json());
                    })
                    //further get authGroup info
                    .mergeMap(() =>{                
                        return this.http.get(this.auth_groups, this.options)
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
        if(!this.state || !this.token || !this.state.authInfo ){
            return Observable.throw('Please first login');
        }
        //url(r'^(?P<g_id>[0-9]+)/assistants/(?P<u_id>[0-9]+)/$', OneGroupAssistantDetail.as_view(), name='one-group-assistant-detail'),
        const remove_assistant_url: string= this.appSetting.URL + this.appSetting.SINGLE_GROUP_API + group_pk + '/assistants/'+ user_pk +'/';
        return this.http.delete(remove_assistant_url, this.options)
                .map((response: Response) =>response.json())
                //further get authGroup info
                .mergeMap(() =>{                
                    return this.http.get(this.auth_groups, this.options)
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
        if(!this.state || !this.token || !this.state.authInfo ){
            return Observable.throw('Please first login');
        }
        //url(r'^(?P<g_id>[0-9]+)/researchers/(?P<u_id>[0-9]+)/$', OneGroupResearcherDetail.as_view(), name='one-group-researcher-detail'),
        const remove_member_url: string= this.appSetting.URL + this.appSetting.SINGLE_GROUP_API + group_pk + '/researchers/'+ user_pk +'/';
        return this.http.delete(remove_member_url, this.options)
                .map((response: Response) =>response.json())
                //further get authGroup info
                .mergeMap(() =>{                
                    return this.http.get(this.auth_groups, this.options)
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
}