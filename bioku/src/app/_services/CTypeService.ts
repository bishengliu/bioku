import { Injectable , Inject} from '@angular/core';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import {APP_CONFIG} from '../_providers/AppSettingProvider';
import { AlertService } from '../_services/AlertService';
// redux
import { AppStore } from '../_providers/ReduxProviders';
// CType class
import { CType, CTypeAttr, CtypeSubAttr} from '../_classes/CType';

@Injectable()
export class CTypeService {
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

        // this.headers_NoContentType = new Headers({ 'Authorization': 'Token ' + this.token });
        // this.options_NoContentType = new RequestOptions({ headers: this.headers_NoContentType });
    }
    // ctype ////////////////////////////
    // get all the material types
    getCTypes() {
        this.updateState();
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CTYPE + 'group_ctypes/';
        return this.http.get(query_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // add new ctype
    addCType(ctype: CType) {
        this.updateState();
        const add_ctype_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPE;
        const body: string = JSON.stringify(ctype);
        return this.http.post(add_ctype_url, body, this.options)
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // update ctype
    updateCType(ctype: CType, ctype_pk: number) {
        this.updateState();
        const update_ctype_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPE + ctype_pk + '/';
        const body: string = JSON.stringify(ctype);
        return this.http.put(update_ctype_url, body, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // delete ctype
    deleteCType(ctype_pk: number) {
        this.updateState();
        const delete_ctype_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPE + ctype_pk + '/';
        return this.http.delete(delete_ctype_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // attr ////////////////////////////////////
    // load ctype attrs
    getCTypeAttrs(ctype_pk: number) {
        this.updateState();
        const get_ctype_attrs_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPE + ctype_pk + '/';
        return this.http.get(get_ctype_attrs_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // add new attr
    addCTypeAttr(ctype_attr: CTypeAttr, ctype_pk: number) {
        this.updateState();
        const add_ctype_attrs_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPE + ctype_pk + '/';
        const body: string = JSON.stringify(ctype_attr);
        return this.http.post(add_ctype_attrs_url, body, this.options)
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // update ctype attr
    updateCTypeAttr(ctype_attr: CTypeAttr, ctype_pk: number, attr_pk: number) {
        this.updateState();
        const update_ctype_attr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPE + ctype_pk + '/' + attr_pk + '/';
        const body: string = JSON.stringify(ctype_attr);
        return this.http.put(update_ctype_attr_url, body, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // delete ctype attr
    deleteCTypeAttr(ctype_pk: number, attr_pk: number) {
        this.updateState();
        const delete_ctype_attr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPE + ctype_pk + '/' + attr_pk + '/';
        return this.http.delete(delete_ctype_attr_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // sub attr //////////////////////////////
    // load ctype sub attrs
    getCTypeSubAttrs(ctype_pk: number, attr_pk: number) {
        this.updateState();
        const get_ctype_attr_subattrs_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPE + ctype_pk + '/' + attr_pk + '/';
        return this.http.get(get_ctype_attr_subattrs_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // add subattr
    addCTypeSubAttr(ctype_subattr: CtypeSubAttr, ctype_pk: number, attr_pk: number) {
        this.updateState();
        const add_ctype_attr_subattr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPE + ctype_pk + '/' + attr_pk + '/';
        const body: string = JSON.stringify(ctype_subattr);
        return this.http.post(add_ctype_attr_subattr_url, body, this.options)
                .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // update subattr
    updateCTypeSubAttr(ctype_subattr: CtypeSubAttr, ctype_pk: number, attr_pk: number, subattr_pk: number) {
        this.updateState();
        const update_ctype_attr_subattr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPE
                                                      + ctype_pk + '/' + attr_pk + '/' + subattr_pk + '/';
        const body: string = JSON.stringify(ctype_subattr);
        return this.http.put(update_ctype_attr_subattr_url, body, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // delete subattr
    deleteCTypeSubAttr(ctype_pk: number, attr_pk: number, subattr_pk: number) {
        this.updateState();
        const delete_ctype_attr_subattr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPE
                                                      + ctype_pk + '/' + attr_pk + '/' + subattr_pk + '/';
        return this.http.delete(delete_ctype_attr_subattr_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
