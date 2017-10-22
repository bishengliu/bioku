import { Injectable , Inject} from '@angular/core';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import {APP_CONFIG} from '../_providers/AppSettingProvider';
import { AlertService } from '../_services/AlertService';
// redux
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class GroupService {

    private state: any;
    private token: string;
    private headers: Headers;
    private options: RequestOptions;
    private headers_NoContentType: Headers;
    private options_NoContentType: RequestOptions;

    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
                private router: Router, private alertService: AlertService) {}

    updateState() {
        this.state = this.appStore.getState();
        if (!this.state || !this.state.authInfo || !this.state.authInfo.authUser || !this.state.authInfo.token) {
            this.alertService.error('Please first login!', true);
            this.router.navigate(['/login']);
        }
        this.token = this.state.authInfo.token.token;
        this.headers = new Headers({ 'Authorization': 'Token ' + this.token, 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });

        this.headers_NoContentType = new Headers({ 'Authorization': 'Token ' + this.token });
        this.options_NoContentType = new RequestOptions({ headers: this.headers_NoContentType });
    }

    addAssistant(group_pk: number, email: string) {
        this.updateState();
        const auth_groups = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
        const find_user = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
        if (this.state.authInfo.authUser.roles.indexOf('PI') === -1) {
            return Observable.throw('Please login as a PI user!');
        }
        // url(r'^(?P<pk>[0-9]+)/assistants/$', OneGroupAssistantList.as_view(), name='one-group-assistant-list'),
        const add_assistant_url: string = this.appSetting.URL + this.appSetting.SINGLE_GROUP_API + group_pk + '/assistants/';
        const body: string = JSON.stringify({'query': 'email', 'value': email});
        return this.http.post(find_user, body, this.options)
                    .map((response: Response) => response.json())
                    // .do((data:any)=>{console.log(data)})
                    .mergeMap((data: any) => {
                        const body2: string = JSON.stringify({'group_id': group_pk, 'user_id': data.user.pk});
                        return this.http.post(add_assistant_url, body2, this.options)
                                    .map((response: Response) => response.json());
                    })
                    // further get authGroup info
                    .mergeMap(() => {
                        return this.http.get(auth_groups, this.options)
                            .map((response: Response) => response.json())
                            .map((res: any) => {
                                    return Object.assign({}, {'groups': res});
                            })
                            .catch((error: any) => {
                                    console.log(error)
                                    return Observable.of(Object.assign({}, {'groups': null}));
                            });
                    })
                    .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    addMember(group_pk: number, email: string) {
        this.updateState();
        const auth_groups = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
        const find_user = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
        if (this.state.authInfo.authUser.roles.indexOf('PI') === -1) {
            return Observable.throw('Please login as a PI user!');
        }
        // url(r'^(?P<pk>[0-9]+)/researchers/$', OneGroupResearcherList.as_view(), name='one-group-researcher-list'),
        const add_member_url: string = this.appSetting.URL + this.appSetting.SINGLE_GROUP_API + group_pk + '/researchers/';
        const body: string = JSON.stringify({'query': 'email', 'value': email});
        return this.http.post(find_user, body, this.options)
                    .map((response: Response) => response.json())
                    .mergeMap((data: any) => {
                        const body2: string = JSON.stringify({'group_id': group_pk, 'user_id': data.user.pk});
                        return this.http.post(add_member_url, body2, this.options)
                                    .map((response: Response) => response.json());
                    })
                    // further get authGroup info
                    .mergeMap(() => {
                        return this.http.get(auth_groups, this.options)
                            .map((response: Response) => response.json())
                            .map((res: any) => {
                                    return Object.assign({}, {'groups': res});
                            })
                            .catch((error: any) => {
                                    console.log(error)
                                    return Observable.of(Object.assign({}, {'groups': null}));
                            });
                    })
                    .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    removeAssistant(group_pk: number, user_pk: number) {
        this.updateState();
        const auth_groups = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
        const find_user = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
        if (this.state.authInfo.authUser.roles.indexOf('PI') === -1) {
            return Observable.throw('Please login as a PI user!');
        }
        // url(r'^(?P<g_id>[0-9]+)/assistants/(?P<u_id>[0-9]+)/$', OneGroupAssistantDetail.as_view(), name='one-group-assistant-detail'),
        const remove_assistant_url: string = this.appSetting.URL + this.appSetting.SINGLE_GROUP_API +
                                            group_pk + '/assistants/' + user_pk + '/';
        return this.http.delete(remove_assistant_url, this.options)
                .map((response: Response) => response.json())
                // further get authGroup info
                .mergeMap(() => {
                    return this.http.get(auth_groups, this.options)
                        .map((response: Response) => response.json())
                        .map((res: any) => {
                                return Object.assign({},  {'groups': res});
                        })
                        .catch((error: any) => {
                                console.log(error)
                                return Observable.of(Object.assign({}, {'groups': null}));
                        });
                })
                .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    removeMember(group_pk: number, user_pk: number) {
        this.updateState();
        const auth_groups = this.appSetting.URL + this.appSetting.AUTH_GROUPS;
        const find_user = this.appSetting.URL + this.appSetting.FIND_USER_DETAILS;
        if (this.state.authInfo.authUser.roles.indexOf('PI') === -1) {
            return Observable.throw('Please login as a PI user!');
        }
        // url(r'^(?P<g_id>[0-9]+)/researchers/(?P<u_id>[0-9]+)/$', OneGroupResearcherDetail.as_view(), name='one-group-researcher-detail'),
        const remove_member_url: string = this.appSetting.URL + this.appSetting.SINGLE_GROUP_API +
                                          group_pk + '/researchers/' + user_pk + '/';
        return this.http.delete(remove_member_url, this.options)
                .map((response: Response) => response.json())
                // further get authGroup info
                .mergeMap(() => {
                    return this.http.get(auth_groups, this.options)
                        .map((response: Response) => response.json())
                        .map((res: any) => {
                                return Object.assign({},  {'groups': res});
                        })
                        .catch((error: any) => {
                                console.log(error)
                                return Observable.of(Object.assign({}, {'groups': null}));
                        });
                })
                .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // get the list of all researcher groups
    getAllGroups() {
        this.updateState();
        if (!this.state.authInfo.authUser.is_superuser) {
            return Observable.throw('Please login as Admin');
        }
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_GROUPS;
        return this.http.get(query_url, this.options)
            .map((response: Response) => response.json())
            // .do(data=>console.log(data))
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // get group count
    getGroupCount() {
        this.updateState();
        if (!this.state.authInfo.authUser.is_superuser) {
            return Observable.throw('Please login as Admin');
        }
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_GROUPS + 'count/';
        return this.http.get(query_url, this.options)
        .map((response: Response) => response.json())
            // .do(data=>console.log(data))
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // create group
    create(formData: FormData) {
        this.updateState();
        if (!this.state.authInfo.authUser.is_superuser) {
            return Observable.throw('Please login as Admin');
        }
        const create_group_url: string  = this.appSetting.URL + this.appSetting.ALL_GROUPS;
        return this.http.post(create_group_url, formData, this.options_NoContentType) // do provide header accorrding to django
                .map((response: Response) => response.json())
                .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // get group detail
    groupDetail(pk: number) {
        this.updateState();
        if (!this.state.authInfo.authUser.is_superuser) {
            return Observable.throw('Please login as Admin');
        }
        const query_url: string  = this.appSetting.URL + this.appSetting.ALL_GROUPS + pk + '/';
        return this.http.get(query_url, this.options)
            .map((response: Response) => response.json())
            // .do(data=>console.log(data))
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // group edit
    groupUpdate(formData: FormData, pk: number) {
        this.updateState();
        if (!this.state.authInfo.authUser.is_superuser) {
            return Observable.throw('Please login as Admin');
        }
        const update_group_url: string  = this.appSetting.URL + this.appSetting.ALL_GROUPS + pk + '/';
        return this.http.put(update_group_url, formData, this.options_NoContentType) // do provide header accorrding to django
                .map((response: Response) => response.json())
                .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    groupDelete(pk: number) {
        this.updateState();
        if (!this.state.authInfo.authUser.is_superuser) {
            return Observable.throw('Please login as Admin');
        }
        const delete_group_url: string  = this.appSetting.URL + this.appSetting.ALL_GROUPS + pk + '/';
        return this.http.delete(delete_group_url, this.options)
                .map((response: Response) => response.json())
                .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
