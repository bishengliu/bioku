import { Injectable , Inject} from '@angular/core';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import {APP_CONFIG} from '../_providers/AppSettingProvider';
import { AlertService } from '../_services/AlertService';
import { MoveSample } from '../_classes/MoveSample';
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
    //////////////////////////////////////////////////////////////////ADMIN///////////////////////////////////////////////////////
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
            //.do(data=>console.log(data))
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
        return this.http.put(update_container_url, formData, this.options_NoContentType) //do provide header accorrding to django
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

    ////////////////////////////////////////////////PI OR assistants or researchers/////////////////////////////////////
    myContainers(){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS;
        return this.http.get(query_url, this.options)
            .map((response: Response) =>response.json())
            //.do(data=>console.log(data))
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    //GET THE GROUP BOXES IN A CONTAINER
    containerGroupBoxes(container_pk: number){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/boxes/"; 
        return this.http.get(query_url, this.options)
            .map((response: Response) =>response.json())
            //.do(data=>console.log(data))
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //get all the occupied boxes in a container
    containerAllBoxes(container_pk: number){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/all_boxes/"; 
        return this.http.get(query_url, this.options)
            .map((response: Response) =>response.json())
            //.do(data=>console.log(data))
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //get one box
    getContainerBox(container_pk: number, box_position: string){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/" + box_position + "/";
        return this.http.get(query_url, this.options)
            .map((response: Response) =>response.json())
            //.do(data=>console.log(data))
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //put the box color
    updateBoxRate(container_pk: number, box_position: string, rate: number){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/" + box_position + "/rate/";
        let body: string = JSON.stringify({'rate': rate });
        return this.http.put(query_url, body, this.options) //do provide header accorrding to django
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //put box rate
    updateBoxColor(container_pk: number, box_position: string, color: string){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/" + box_position + "/color/";
        let body: string = JSON.stringify({'color': color });
        return this.http.put(query_url, body, this.options) //do provide header accorrding to django
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //put box description
    updateBoxDescription(container_pk: number, box_position: string, description: string){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/" + box_position + "/description/";
        let body: string = JSON.stringify({'description': description });
        return this.http.put(query_url, body, this.options) //do provide header accorrding to django
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //put box label
    updateBoxLabel(container_pk: number, box_position: string, label: string){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/" + box_position + "/label/";
        let body: string = JSON.stringify({'label': label });
        return this.http.put(query_url, body, this.options) //do provide header accorrding to django
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //move one box
    moveContainerBoxes(original_container: number, box_full_position: string, target_container: number, target_box_full_position: string){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + "move_box/";
        let body: string = JSON.stringify({
            'original_container': original_container, 
            'box_full_position': box_full_position, 
            'target_container': target_container, 
            'target_box_full_position': target_box_full_position});
        return this.http.post(query_url, body, this.options)
                    .map((response: Response) =>response.json())          
                    .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //add one box
    addContainerBox(container_pk: number, box_full_position: string, box_horizontal: number, box_vertical: number){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/add_box/";
        let body: string = JSON.stringify({
            'container_pk': container_pk, 
            'box_full_position': box_full_position, 
            'box_horizontal': box_horizontal, 
            'box_vertical': box_vertical});
        return this.http.put(query_url, body, this.options) //do provide header accorrding to django
            .map((response: Response) =>response.json())          
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //////////////////////////////////samples//////////////////////////////////////////
    updateSampleDetail(container_pk: number, box_position: string, sample_position: string, data_attr: string, value: any){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/" + box_position + "/" + sample_position + "/update/";
        let body: string = JSON.stringify({'key': data_attr, 'value': value });
        return this.http.put(query_url, body, this.options) //do provide header accorrding to django
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //update sample position
    updateSamplePosition(container_pk: number, box_position: string, sample_position: string, new_vposition: string, new_hposition: number){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/" + box_position + "/" + sample_position + "/update_position/";
        let body: string = JSON.stringify({'new_vposition': new_vposition, 'new_hposition': new_hposition });
        return this.http.put(query_url, body, this.options)
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //switch sample positions
    switchSamplePosition(container_pk: number, box_position: string, first_sample_position: string, second_sample_position: string){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/" + box_position + "/switch_positions/";
        let body: string = JSON.stringify({
            'box_full_position': box_position, 
            'first_sample': first_sample_position,
            'second_sample': second_sample_position});
        return this.http.put(query_url, body, this.options)
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    //switch sample positon between 2 boxes
    switchSample2Boxes(moveSample: MoveSample){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + "switch_samples/";
        let body: string = JSON.stringify(moveSample);
        return this.http.put(query_url, body, this.options)
            .map((response: Response) =>response.json())          
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    takeSampleOut(container_pk: number, box_position: string, sample_position: string){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/" + box_position + "/" + sample_position + "/take/";
        let body: string = JSON.stringify({ });
        return this.http.put(query_url, body, this.options)
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    putSampleBack(container_pk: number, box_position: string, sample_position: string){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + container_pk + "/" + box_position + "/" + sample_position + "/back/";
        let body: string = JSON.stringify({ });
        return this.http.put(query_url, body, this.options)
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    //delete an attachment
    deleteAttachment(sample_pk: number, attachment_pk: number){
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CONTAINERS + "samples/" + sample_pk + "/" + attachment_pk + "/";
        let body: string = JSON.stringify({ });
        return this.http.put(query_url, body, this.options)
                .map((response: Response) =>response.json())          
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
}
