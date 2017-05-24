import { Injectable , Inject} from '@angular/core';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import {APP_CONFIG} from '../_providers/AppSettingProvider';
import { AlertService } from '../_services/AlertService';
//redux
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class ContainerService{

    private state: any;
    private token: string;
    private headers: Headers;
    private options: RequestOptions;
    private headers_NoContentType: Headers;
    private options_NoContentType: RequestOptions;

    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
                private router: Router, private alertService: AlertService)
    {
        this.state = this.appStore.getState();
        if(!this.state || !this.state.authInfo || !this.state.authInfo.authUser || !this.state.authInfo.token){
            this.alertService.error('Please first login!', true);
            this.router.navigate(['/login']);
        }
        this.token = this.state.authInfo.token.token;
        this.headers = new Headers({ 'Authorization': 'Token '+ this.token, 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });

        this.headers_NoContentType = new Headers({ 'Authorization': 'Token '+ this.token });
        this.options_NoContentType = new RequestOptions({ headers: this.headers_NoContentType });
    }
    
    //get container count
    getContainerCount(){
        if(!this.state.authInfo.authUser.is_superuser){
            this.alertService.error('Please login as Admin!', true);
            return Observable.throw('Please login as Admin');
        }
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS+ 'count/';
        return this.http.get(query_url, this.options)
        .map((response: Response) =>response.json())
        //.do(data=>console.log(data))
        .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    getAllContainers(){
        if(!this.state.authInfo.authUser.is_superuser){
            this.alertService.error('Please login as Admin!', true);
            return Observable.throw('Please login as Admin');
        }
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS;
        return this.http.get(query_url, this.options)
            .map((response: Response) =>response.json())
            .do(data=>console.log(data))
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    create(formData: FormData){
        if(!this.state.authInfo.authUser.is_superuser){
            this.alertService.error('Please login as Admin!', true);
            return Observable.throw('Please login as Admin');
        }
        const create_container_url: string  = this.appSetting.URL + this.appSetting.ALL_CONTAINERS;
        return this.http.post(create_container_url, formData, this.options_NoContentType) //do provide header accorrding to django
                //.map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    //get group detail
    containerDetail(pk: number){      
        if(!this.state.authInfo.authUser.is_superuser){
            this.alertService.error('Please login as Admin!', true);
            return Observable.throw('Please login as Admin');
        }
        const query_url: string  = this.appSetting.URL + this.appSetting.ALL_CONTAINERS+ pk +"/";
        return this.http.get(query_url, this.options)
            .map((response: Response) =>response.json())
            //.do(data=>console.log(data))           
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    containerUpdate(formData: FormData, pk: number){
        if(!this.state.authInfo.authUser.is_superuser){
            this.alertService.error('Please login as Admin!', true);
            return Observable.throw('Please login as Admin');
        }
        const update_container_url: string  = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + pk+'/';
        return this.http.put(update_container_url, formData, this.headers_NoContentType) //do provide header accorrding to django
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    containerDelete(pk: number){        
        if(!this.state.authInfo.authUser.is_superuser){
            this.alertService.error('Please login as Admin!', true);
            return Observable.throw('Please login as Admin');
        }
        const delete_container_url: string  = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + pk +'/';
        return this.http.delete(delete_container_url, this.options) //do provide header accorrding to django
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    //add container to a group
    addContainer2Group(container_pk: number, group_pk: number){
        if(!this.state.authInfo.authUser.is_superuser){
            this.alertService.error('Please login as Admin!', true);
            return Observable.throw('Please login as Admin');
        }
        const query_url: string  = this.appSetting.URL + this.appSetting.ALL_CONTAINERS+ container_pk + "/groups/";
        let body: string = JSON.stringify({'container_id': container_pk, 'group_id': group_pk});
        return this.http.post(query_url, body, this.options)
                   .map((response: Response) =>response.json())
                   .mergeMap((data:any)=>{
                       const query_url2: string  = this.appSetting.URL + this.appSetting.ALL_GROUPS+ group_pk + "/";
                       return this.http.get(query_url2, this.options)
                                  .retry(2)
                                  .map((response: Response) =>response.json())
                   })
                   .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //remove a group from the container
    removeGroupFromContainer(container_pk: number, group_pk: number){
        if(!this.state.authInfo.authUser.is_superuser){
            this.alertService.error('Please login as Admin!', true);
            return Observable.throw('Please login as Admin');
        }
        const query_url: string  = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/groups/" + group_pk +"/";
        return this.http.delete(query_url, this.options) //do provide header accorrding to django
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    allowRemoveGroup(container_pk: number, group_pk: number){
        if(!this.state.authInfo.authUser.is_superuser){
            this.alertService.error('Please login as Admin!', true);
            return Observable.throw('Please login as Admin');
        }
        const query_url: string  = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/groups/" + group_pk + "/";
        let body: string = JSON.stringify({});
        return this.http.post(query_url, body, this.options) //do provide header accorrding to django
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
}

