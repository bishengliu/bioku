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
import { CType, CTypeAttr, CTypeSubAttr} from '../_classes/CType';

@Injectable()
export class CTypeService {
    private state: any;
    private token: string;
    private headers: Headers;
    private options: RequestOptions;
    private headers_NoContentType: Headers;
    private options_NoContentType: RequestOptions;
    private mattrs: Array<CTypeAttr> = new Array<CTypeAttr>()
    private battrs: Array<CTypeAttr> = new Array<CTypeAttr>()
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
                private router: Router, private alertService: AlertService) {
                    // minimal attrs
                    // name
                    let name_attr: CTypeAttr = new CTypeAttr();
                    name_attr = {
                        pk: -1, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'name',
                        attr_label: 'NAME',
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: true,
                        attr_order: 0,
                        has_sub_attr: false,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    this.mattrs.push(name_attr);
                    // storage_date
                    let storage_date_attr: CTypeAttr = new CTypeAttr();
                    storage_date_attr = {
                        pk: -2, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'storage_date',
                        attr_label: 'STORAGE_DATE',
                        attr_value_type: 4, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: false,
                        attr_order: 1,
                        has_sub_attr: false,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    this.mattrs.push(storage_date_attr);
                    // attachments
                    let attachment_attr: CTypeAttr = new CTypeAttr();
                    attachment_attr = {
                        pk: -3, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'attachments',
                        attr_label: 'ATTACHMENTS',
                        attr_value_type: 3, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: false,
                        attr_order: -1, // last
                        has_sub_attr: true,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    // attachment subattr
                    const attachment_subattrs: Array<CTypeSubAttr> = new Array<CTypeSubAttr>();
                    // label
                    let attachment_subattr_label: CTypeSubAttr = new CTypeSubAttr();
                    attachment_subattr_label = {
                        pk: -1, // no pk
                        ctype_id: null, // no ctype
                        parent_attr_id: null,
                        parent_attr: 'attachments',
                        attr_name: 'label',
                        attr_label: 'FILE_LABEL',
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: true,
                        attr_order: 1, // last
                    }
                    attachment_subattrs.push(attachment_subattr_label);
                    // filename
                    let attachment_subattr_attachment: CTypeSubAttr = new CTypeSubAttr();
                    attachment_subattr_attachment = {
                        pk: -2, // no pk
                        ctype_id: null, // no ctype
                        parent_attr_id: null,
                        parent_attr: 'attachments',
                        attr_name: 'attachment',
                        attr_label: 'FILE',
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: true,
                        attr_order: 0, // last
                    }
                    attachment_subattrs.push(attachment_subattr_attachment);
                    // description
                    let attachment_subattr_description: CTypeSubAttr = new CTypeSubAttr();
                    attachment_subattr_description = {
                        pk: -3, // no pk
                        ctype_id: null, // no ctype
                        parent_attr_id: null,
                        parent_attr: 'attachments',
                        attr_name: 'description',
                        attr_label: 'DESCRIPTION',
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: false,
                        attr_order: 3, // last
                    }
                    attachment_subattrs.push(attachment_subattr_description);
                    attachment_attr.subattrs = attachment_subattrs;
                    this.mattrs.push(attachment_attr);
                    // end minimal attrs
                    // basic attrs
                    // container
                    let container_attr: CTypeAttr = new CTypeAttr();
                    container_attr = {
                        pk: -1, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'container',
                        attr_label: 'CONTAINER',
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: true,
                        attr_order: 4,
                        has_sub_attr: false,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    this.battrs.push(container_attr);
                    // box
                    let box_attr: CTypeAttr = new CTypeAttr();
                    box_attr = {
                        pk: -1, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'box_position',
                        attr_label: 'BOX',
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: true,
                        attr_order: 5,
                        has_sub_attr: false,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    this.battrs.push(box_attr);
                    // sample position
                    let pos_attr: CTypeAttr = new CTypeAttr();
                    pos_attr = {
                        pk: -1, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'position',
                        attr_label: 'POSITION',
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: true,
                        attr_order: 6,
                        has_sub_attr: false,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    this.battrs.push(pos_attr);
                    // add minimal attrs
                    this.battrs = [...this.battrs, ...this.mattrs];
                }
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
    // BIOKU minimal sample attrs
    getMinimalCTypeAttrs(): Array<CTypeAttr> {
        return this.mattrs;
    }
    getMinimalCtypeAttr(pk: number): CTypeAttr {
        return this.mattrs.find(a => a.pk === pk) || new CTypeAttr();
    }
    getBasicCTypeAttrs(): Array<CTypeAttr> {
        return this.battrs;
    }
    getBasicCtypeAttr(pk: number): CTypeAttr {
        return this.battrs.find(a => a.pk === pk) || new CTypeAttr();
    }
    // get common sample attrs
    // if only one ctype return all the attrs
    getCommonAttrs(sampel_ctypes: Array<CType>): Array<string> {
        const sample_attrs: Array<string> = new Array<string>();
        // loop into the ctypes
        sampel_ctypes.forEach((c: CType) => {
            // loop into its attrs
            c.attrs.forEach( (a: CTypeAttr) => {
              let is_common = true;
              // check whether all the ctypes have the label
              sampel_ctypes.forEach((ct: CType) => {
                if (ct.attrs.findIndex((ca: CTypeAttr) => {
                  return ca.attr_label === a.attr_label
                }) === -1) {is_common = false; }
              });
              if (is_common) {
                sample_attrs.push(a.attr_label)
              }
            })
        })
        return sample_attrs;
    }
    getMaxAttrs(sampel_ctypes: Array<CType>): Array<string> {
        let sample_attrs: Array<string> = new Array<string>();
        // loop into the ctypes
        sampel_ctypes.forEach((c: CType) => {
            // loop into its attrs
            sample_attrs = Object.assign(sample_attrs, c.attrs.map(( a: CTypeAttr) => { return a.attr_label }));
        })
        return sample_attrs;
    }
    // get all the material types
    getCTypes() {
        this.updateState();
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CTYPES;
        return this.http.get(query_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // get a type detail
    getCTypeDetail(ctype_pk: number) {
        this.updateState();
        const query_url: string = this.appSetting.URL + this.appSetting.ALL_CTYPES + ctype_pk + '/';
        return this.http.get(query_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // add new ctype
    addCType(ctype: CType) {
        this.updateState();
        const add_ctype_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES;
        const body: string = JSON.stringify(ctype);
        return this.http.post(add_ctype_url, body, this.options)
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // update ctype
    updateCType(ctype: CType, ctype_pk: number) {
        this.updateState();
        const update_ctype_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES + ctype_pk + '/';
        const body: string = JSON.stringify(ctype);
        return this.http.put(update_ctype_url, body, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // delete ctype
    deleteCType(ctype_pk: number) {
        this.updateState();
        const delete_ctype_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES + ctype_pk + '/';
        return this.http.delete(delete_ctype_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // attr ////////////////////////////////////
    // load ctype attrs
    getCTypeAttrs(ctype_pk: number) {
        this.updateState();
        const get_ctype_attrs_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES + ctype_pk + '/attrs/';
        return this.http.get(get_ctype_attrs_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // get CTypeAttrDetail
    getCTypeAttrDetail(ctype_pk: number, attr_pk: number) {
        this.updateState();
        const get_ctype_attr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES + ctype_pk + '/attrs/' + attr_pk + '/';
        return this.http.get(get_ctype_attr_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // add new attr
    addCTypeAttr(ctype_attr: CTypeAttr, ctype_pk: number) {
        this.updateState();
        const add_ctype_attrs_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES + ctype_pk + '/attrs/';
        const body: string = JSON.stringify(ctype_attr);
        return this.http.post(add_ctype_attrs_url, body, this.options)
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // update ctype attr
    updateCTypeAttr(ctype_attr: CTypeAttr, ctype_pk: number, attr_pk: number) {
        this.updateState();
        const update_ctype_attr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES + ctype_pk + '/attrs/' + attr_pk + '/';
        const body: string = JSON.stringify(ctype_attr);
        return this.http.put(update_ctype_attr_url, body, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // delete ctype attr
    deleteCTypeAttr(ctype_pk: number, attr_pk: number) {
        this.updateState();
        const delete_ctype_attr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES + ctype_pk + '/attrs/' + attr_pk + '/';
        return this.http.delete(delete_ctype_attr_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // sub attr //////////////////////////////
    // load ctype sub attrs
    getCTypeSubAttrs(ctype_pk: number, attr_pk: number) {
        this.updateState();
        const get_ctype_attr_subattrs_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES
                                                    + ctype_pk + '/attrs/' + attr_pk + '/subattrs/';
        return this.http.get(get_ctype_attr_subattrs_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // sub attr detail
    getCTypeSubAttrDetail(ctype_pk: number, attr_pk: number, subattr_pk: number) {
        this.updateState();
        const get_ctype_attr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES + ctype_pk
                                                + '/attrs/' + attr_pk + '/subattrs/' + subattr_pk + '/';
        return this.http.get(get_ctype_attr_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // add subattr
    addCTypeSubAttr(ctype_subattr: CTypeSubAttr, ctype_pk: number, attr_pk: number) {
        this.updateState();
        const add_ctype_attr_subattr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES
                                                   + ctype_pk + '/attrs/' + attr_pk + '/subattrs/';
        const body: string = JSON.stringify(ctype_subattr);
        return this.http.post(add_ctype_attr_subattr_url, body, this.options)
                .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // update subattr
    updateCTypeSubAttr(ctype_subattr: CTypeSubAttr, ctype_pk: number, attr_pk: number, subattr_pk: number) {
        this.updateState();
        const update_ctype_attr_subattr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES
                                                      + ctype_pk + '/attrs/' + attr_pk + '/subattrs/' + subattr_pk + '/';
        const body: string = JSON.stringify(ctype_subattr);
        return this.http.put(update_ctype_attr_subattr_url, body, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // delete subattr
    deleteCTypeSubAttr(ctype_pk: number, attr_pk: number, subattr_pk: number) {
        this.updateState();
        const delete_ctype_attr_subattr_url: string  = this.appSetting.URL + this.appSetting.ALL_CTYPES
                                                      + ctype_pk + '/attrs/' + attr_pk + '/subattrs/' + subattr_pk + '/';
        return this.http.delete(delete_ctype_attr_subattr_url, this.options)
                        .map((response: Response) => response.json())
                        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
