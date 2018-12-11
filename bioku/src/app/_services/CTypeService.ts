import { Injectable , Inject} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting } from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
import { AlertService } from '../_services/AlertService';
import { UtilityService } from '../_services/UtilityService';
// redux
import { AppStore } from '../_providers/ReduxProviders';
// CType class
import { CType, CTypeAttr, MCTypeAttr, CTypeSubAttr, CSample, CSampleData,
    CSampleSubData, MCSampleSubData, CSubAttrData, MCSubAttrData, MCTypeSubAttr} from '../_classes/CType';
import { Sample, Attachment } from '../_classes/Sample';
import { isArray } from 'util';
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
    private customized_attrs: Array<any> = new Array<any> ();
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
                private router: Router, private alertService: AlertService, private utilityService: UtilityService) {
                    // first set up the customized attrs
                    this.customized_attrs = this.appSetting.CUSTOMIZED_ATTRS;
                    // minimal attrs
                    // name
                    let name_attr: CTypeAttr = new CTypeAttr();
                    name_attr = {
                        pk: -1, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'name',
                        attr_label: this.utilityService.
                                    getCustomizedSampleAttrLabel('name', this.customized_attrs), // 'NAME'
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
                        attr_label: this.utilityService.
                                    getCustomizedSampleAttrLabel('storage_date', this.customized_attrs), // 'STORAGE_DATE'
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
                        attr_label: this.utilityService.
                                    getCustomizedSampleAttrLabel('attachments', this.customized_attrs), // 'ATTACHMENTS'
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
                        attr_label: this.utilityService.
                                    getCustomizedSampleAttachmentAttrLabel('label', this.customized_attrs), // FILE_LABEL
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
                        attr_label: this.utilityService.
                        getCustomizedSampleAttachmentAttrLabel('attachment', this.customized_attrs), // FILE
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
                        attr_label: this.utilityService.
                                    getCustomizedSampleAttachmentAttrLabel('description', this.customized_attrs), // DESCRIPTION
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
                    // researchers
                    let researcher_attr: CTypeAttr = new CTypeAttr();
                    researcher_attr = {
                        pk: -4, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'researchers',
                        attr_label: this.utilityService.
                                    getCustomizedSampleAttrLabel('researchers', this.customized_attrs), // 'NAME'
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: false,
                        attr_order: 4,
                        has_sub_attr: false,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    this.mattrs.push(researcher_attr);
                    // end minimal attrs
                    // basic attrs
                    // container
                    let container_attr: CTypeAttr = new CTypeAttr();
                    container_attr = {
                        pk: -5, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'container',
                        attr_label: this.utilityService.
                                    getCustomizedSampleAttrLabel('container', this.customized_attrs), // CONTAINER
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: true,
                        attr_order: 5,
                        has_sub_attr: false,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    this.battrs.push(container_attr);
                    // box
                    let box_attr: CTypeAttr = new CTypeAttr();
                    box_attr = {
                        pk: -6, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'box_position',
                        attr_label: this.utilityService.
                                    getCustomizedSampleAttrLabel('box_position', this.customized_attrs), // BOX
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: true,
                        attr_order: 6,
                        has_sub_attr: false,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    this.battrs.push(box_attr);
                    // sample position
                    let pos_attr: CTypeAttr = new CTypeAttr();
                    pos_attr = {
                        pk: -7, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'position',
                        attr_label: this.utilityService.
                                    getCustomizedSampleAttrLabel('position', this.customized_attrs), // POSITION
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: true,
                        attr_order: 7,
                        has_sub_attr: false,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    this.battrs.push(pos_attr);
                    // occupied
                    let occupied_attr: CTypeAttr = new CTypeAttr();
                    occupied_attr = {
                        pk: -8, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'occupied',
                        attr_label: this.utilityService.
                                    getCustomizedSampleAttrLabel('occupied', this.customized_attrs), // POSITION
                        attr_value_type: 0, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: false,
                        attr_order: 8,
                        has_sub_attr: false,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    this.battrs.push(occupied_attr);
                    // date out
                    let dateout_attr: CTypeAttr = new CTypeAttr();
                    dateout_attr = {
                        pk: -9, // no pk
                        ctype_id: null, // no ctype
                        attr_name: 'date_out',
                        attr_label: this.utilityService.
                                    getCustomizedSampleAttrLabel('date_out', this.customized_attrs), // POSITION
                        attr_value_type: 4, // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
                        attr_value_text_max_length: null,
                        attr_value_decimal_total_digit: null,
                        attr_value_decimal_point: null,
                        attr_required: false,
                        attr_order: 9,
                        has_sub_attr: false,
                        subattrs: new Array<CTypeSubAttr>()
                    }
                    this.battrs.push(dateout_attr);
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
    // get common sample attrs: label only
    // if only one ctype return all the attrs
    getCommonAttrs(sample_ctypes: Array<CType>, exclude_date = false): Array<string> {
        const sample_attrs: Array<string> = new Array<string>();
        // loop into the ctypes
        sample_ctypes.forEach((c: CType) => {
            // loop into its attrs
            c.attrs.forEach( (a: CTypeAttr) => {
              let is_common = true;
              is_common = a.attr_value_type !== null &&  a.attr_value_type === 4 // date
              ? (exclude_date ? false : true)
              : true;
              if (is_common) {
                // check whether all the ctypes have the label
                sample_ctypes.forEach((ct: CType) => {
                    if (ct.attrs.findIndex((ca: CTypeAttr) => {
                    return ca.attr_label.toUpperCase() === a.attr_label.toUpperCase();
                    }) === -1) { is_common = false; }
                });
                if (is_common && sample_attrs.indexOf(a.attr_label.toUpperCase()) === -1) {
                    sample_attrs.push(a.attr_label)
                }
              }
            })
        })
        return sample_attrs;
    }
    getMaxAttrs(sample_ctypes: Array<CType>, exclude_date = false): Array<string> {
        const sample_attrs: Array<string> = new Array<string>();
        // loop into the ctypes
        sample_ctypes.forEach((c: CType) => {
            // loop into its attrs
            c.attrs.forEach((a: CTypeAttr) => {
                if (sample_attrs.indexOf(a.attr_label.toUpperCase()) === -1) {
                    if (a.attr_value_type === 4) {
                        if (!exclude_date) {
                            sample_attrs.push(a.attr_label.toUpperCase());
                        }
                    } else {
                        sample_attrs.push(a.attr_label.toUpperCase());
                    }
                }
            });
        })
        return sample_attrs;
    }
    // convert ctype name to pk
    convertCTypeName2PK(type_name: string, all_ctypes: Array<CType>): number {
        let pk: number = null;
        const found: CType = all_ctypes.find((ctype: CType) => { return ctype.type.toUpperCase() === type_name.toUpperCase(); });
        if (found !== undefined) {
            pk = found.pk;
        }
        return pk;
    }
    // get common full sample attrs
    getCTypesByNames(ctype_names: Array<string>, all_ctypes: Array<CType>): Array<CType> {
        const ctypes: Array<CType> = new Array<CType>();
        for (let i = 0; i < ctype_names.length; i++) {
           const ctype = all_ctypes.find((ct: CType) => { return ct.type === ctype_names[i]; })
            if (ctype !== undefined) {
                ctypes.push(ctype);
            }
        }
        return ctypes;
    }
    getSampleTypes(USE_CSAMPLE: boolean, samples: Array<any>): Array<string> {
        const types = new Array<string>();
        if (samples != null && samples.length > 0) {
            if (USE_CSAMPLE) {
              samples.forEach((s: CSample) => {
                if (s.ctype != null && s.ctype !== undefined
                  && types.indexOf(s.ctype.type) === -1) {
                  types.push(s.ctype.type);
                }
              })
            } else {
              samples.forEach((s: Sample) => {
                if (s.type != null && s.type !== undefined
                  && types.indexOf(s.type) === -1) {
                  types.push(s.type);
                }
              })
            }
          }
        return types;
    }
    genSamplesAttrs(samples: Array<CSample>, USE_CSAMPLE: boolean,
        DISPLAY_COMMON_ATTRS: boolean, all_ctypes: Array<CType>,
        sample_types: Array<string>, exclude_date = false, full_load = false): Array<string> {
        let attrs = new Array<string>();
        if (samples !== undefined && samples !== null && USE_CSAMPLE) {
            // get basic attrs
            const ctype_basic_attrs: Array<CTypeAttr> = this.getBasicCTypeAttrs();
            ctype_basic_attrs.forEach((a: CTypeAttr) => {
                // load everything
                if (full_load) {
                    if (attrs.indexOf(a.attr_label) === -1) {
                    attrs.push(a.attr_label);
                  }
                } else {
                    // exclude researcher and attachments
                    if (attrs.indexOf(a.attr_label) === -1
                && a.attr_label !== this.utilityService.
                getCustomizedSampleAttrLabel('attachments', this.customized_attrs)
                && a.attr_label !== this.utilityService.
                getCustomizedSampleAttrLabel('researchers', this.customized_attrs)) {
                attrs.push(a.attr_label); }
                }
            })
            // get only relevant ctypes
            let box_sample_ctypes: Array<CType> = new Array<CType>();
            if (all_ctypes !== null) {
              box_sample_ctypes = all_ctypes.filter((c: CType) => {
                return sample_types.indexOf(c.type) !== -1;
              })
            }
            if (box_sample_ctypes != null) {
              if (DISPLAY_COMMON_ATTRS) {
                // only display common sample attrs
                attrs = [...attrs, ...this.getCommonAttrs(box_sample_ctypes, exclude_date)];
              } else {
                // display max sample attr
                attrs = [...attrs, ...this.getMaxAttrs(box_sample_ctypes, exclude_date)];
              }
            } else {
              // loop into samples to get the attrs
              samples.forEach((s: CSample) => {
                if (s.ctype != null && s.ctype.attrs != null) {
                  attrs = [...attrs,
                    ...s.ctype.attrs.map((a: CTypeAttr) => { return a.attr_label })];
                }
              });
            }
          }
          return attrs;
    }
    genSampleAttrs(sample: CSample, full_load = false): Array<string> {
        let attrs = new Array<string>();
        // get the basic attrs
        const ctype_basic_attrs: Array<CTypeAttr> = this.getBasicCTypeAttrs();
          ctype_basic_attrs.forEach((a: CTypeAttr) => {
            if (full_load) {
                if (attrs.indexOf(a.attr_label) === -1) {
                  attrs.push(a.attr_label);
                }
            } else {
                if (attrs.indexOf(a.attr_label) === -1
                && a.attr_label !== this.utilityService.
                getCustomizedSampleAttrLabel('attachments', this.customized_attrs)
                && a.attr_label !== this.utilityService.
                getCustomizedSampleAttrLabel('researchers', this.customized_attrs)) {
                  attrs.push(a.attr_label);
                }
            }
          })
        // get extra attrs
        if (sample != null
          && sample.ctype !== undefined && sample.ctype !== null
          && sample.ctype.type !== undefined && sample.ctype.type !== null) {
            attrs = [...attrs, ...sample.ctype.attrs.map((a: CTypeAttr) => { return a.attr_label })];
        }
        return attrs;
    }
    // gen csample ctypeattr
    genSampleCTypeAttrs(sample: CSample, full_load = false): Array<CTypeAttr> {
        let attrs: Array<CTypeAttr> = new Array<CTypeAttr>();
        // get the basic attrs
        const ctype_basic_attrs: Array<CTypeAttr> = this.getBasicCTypeAttrs();
        ctype_basic_attrs.forEach((a: CTypeAttr) => {
            // search for a
            const found = attrs.find((at: CTypeAttr) => { return at.pk === a.pk && at.attr_name === a.attr_name });
            if (full_load) {

                if (found === undefined) {
                    attrs.push(a);
                }
            } else {
                if (found === undefined
                && a.attr_label !== this.utilityService.
                getCustomizedSampleAttrLabel('attachments', this.customized_attrs)
                && a.attr_label !== this.utilityService.
                getCustomizedSampleAttrLabel('researchers', this.customized_attrs)) {
                    attrs.push(a);
                }
            }
        })
        // get extra attrs
        if (sample != null
            && sample.ctype !== undefined && sample.ctype !== null
            && sample.ctype.type !== undefined && sample.ctype.type !== null) {
              attrs = [...attrs, ...sample.ctype.attrs];
          }
        return attrs;
    }
    // get csample extra attr without child attr
    getCSampleCTypeAttrs(sample: CSample): Array<CTypeAttr> {
        return sample.ctype.attrs.filter((a: CTypeAttr) => {
            return a.attr_value_type !== 3;
        })
    }
    // get csample extra complex
    getCSampleCTypeComplexAttrs(sample: CSample): Array<CTypeAttr> {
        return sample.ctype.attrs.filter((a: CTypeAttr) => {
            return a.attr_value_type === 3 && a.has_sub_attr && a.subattrs.length > 0;
        })
    }
    // apply change tag
    // apply only to the parent attr
    genMCTypeAttr(ctype_attrs: Array<CTypeAttr>):  Array<MCTypeAttr> {
        const mctype_attrs: Array<MCTypeAttr> = new Array<MCTypeAttr>();
        // arary for not change
        const non_changables = ['pk', 'box_id', 'container_id', 'occupied', 'researchers', 'ctype_id',
        'type', 'date_in', 'date_out', 'hposition', 'vposition', 'container', 'box_position', 'position'];
        ctype_attrs.forEach((attr: CTypeAttr) => {
            // apply to the parent level
            if (non_changables.indexOf(attr.attr_name) === -1
            && (!attr.has_sub_attr && attr.attr_value_type !== 3)) {
                //  changable
                const mattr = Object.assign(attr,
                    {'is_changable': true},
                    {'is_changing': false},
                    {input_attr: this.utilityService.decodeCTPyeInputAttr(attr)});
                mctype_attrs.push(<MCTypeAttr>mattr);
            } else {
                const mattr = Object.assign(attr, {'is_changable': false}, {'is_changing': false}, {input_attr: null});
                mctype_attrs.push(<MCTypeAttr>mattr);
            }
        });
        return mctype_attrs
    }
    // modify the ctypesubattr
    genMSubAttrData(subattr_data: Array<Array<CSubAttrData>>): Array<Array<MCSubAttrData>> {
        const msubattr_data: Array<Array<MCSubAttrData>> = new Array<Array<MCSubAttrData>>();
        subattr_data.forEach((row_items: Array<CSubAttrData>) => {
            const msubattr_data_items:  Array<MCSubAttrData> = new Array<MCSubAttrData> ();
            row_items.forEach((item: CSubAttrData) => {
                const mcsubattrdata: MCSubAttrData = new MCSubAttrData();
                mcsubattrdata.csample_subdata = new Array<MCSampleSubData>();
                item.csample_subdata.forEach((data: CSampleSubData) => {
                    mcsubattrdata.csample_subdata.push(
                        Object.assign({}, data, {'is_changing': false}, {'is_deleting': false})
                        )
                });
                mcsubattrdata.sub_attr = <MCTypeSubAttr>Object.assign(
                    {},
                    item.sub_attr,
                    {'input_attr': this.utilityService.decodeCTPyeInputAttr(item.sub_attr)})
                msubattr_data_items.push(mcsubattrdata);
            })
            msubattr_data.push(msubattr_data_items);
        });

        return msubattr_data;
    }
    // delete subattr_data
    syncSubAttrDataDeletion(subattr_data: Array<Array<MCSubAttrData>>, table_index: number, data_index: number): Array<Array<MCSubAttrData>> {
        const new_subattr_data: Array<Array<MCSubAttrData>> = new Array<Array<MCSubAttrData>>();
        subattr_data.forEach((row_items: Array<MCSubAttrData>, tindex: number) => {
            const msubattr_data_items:  Array<MCSubAttrData> = new Array<MCSubAttrData> ();
            row_items.forEach((item: MCSubAttrData) => {
                const mcsubattrdata: MCSubAttrData = new MCSubAttrData();
                mcsubattrdata.csample_subdata = new Array<MCSampleSubData>();
                // sub_attr
                mcsubattrdata.sub_attr = <MCTypeSubAttr>Object.assign({}, item.sub_attr);
                // sub_attr_data
                if (table_index !== tindex) {
                    mcsubattrdata.csample_subdata = [...item.csample_subdata];
                } else {
                    mcsubattrdata.csample_subdata = [...item.csample_subdata.filter((data: MCSampleSubData, dindex: number) => {
                        return dindex !== data_index;
                    })];
                }
                if (mcsubattrdata.csample_subdata.length > 0) {
                    msubattr_data_items.push(mcsubattrdata);
                }
            })
            if (msubattr_data_items.length > 0) {
                new_subattr_data.push(msubattr_data_items);
            }
        })
        return new_subattr_data;
    }
    // gen csample displayed view
    genDisplaySample(sample: CSample, attrs: Array<string>) {
        const displayed_sample = {};
        // add some pks
        const keys: Array<string> = [
          'pk', 'box_id', 'container_id', 'color', 'occupied', 'researchers',
          'ctype_id', 'type', 'date_in', 'date_out', 'hposition', 'vposition'
        ];
        keys.forEach((key: string) => {
          if (key === 'type') {
            displayed_sample[key] = sample.ctype && sample.ctype.type ? sample.ctype.type : null;
          } else {
            displayed_sample[key] = sample[key];
          }
        });
        // get the basic attrs
        displayed_sample[this.utilityService.getCustomizedSampleAttrLabel('container', this.customized_attrs)] = sample.container;
        displayed_sample[this.utilityService.getCustomizedSampleAttrLabel('box_position', this.customized_attrs)] = sample.box_position;
        displayed_sample[this.utilityService.getCustomizedSampleAttrLabel('position', this.customized_attrs)] = sample.position;
        displayed_sample[this.utilityService.getCustomizedSampleAttrLabel('name', this.customized_attrs)] = sample.name;
        displayed_sample[this.utilityService.getCustomizedSampleAttrLabel('storage_date', this.customized_attrs)] = sample.storage_date;
        displayed_sample[this.utilityService.getCustomizedSampleAttrLabel('attachments', this.customized_attrs)] = sample.attachments;
        displayed_sample[this.utilityService.getCustomizedSampleAttrLabel('researchers', this.customized_attrs)] = sample.researchers;
        displayed_sample[this.utilityService.getCustomizedSampleAttrLabel('date_out', this.customized_attrs)] = sample.date_out;
        displayed_sample[
            this.utilityService.getCustomizedSampleAttrLabel('occupied', this.customized_attrs)
        ] = sample.occupied ? 'YES' : 'NO';
        // loop into sample attrs
        attrs.forEach((key: string) => {
          if (displayed_sample[key] === undefined) {
            const found_data: CSampleData = sample.csample_data.find( (d: CSampleData) => {
              return d.ctype_attr.attr_label === key;
            })
            if (found_data !== undefined) {
              displayed_sample[key] = (
                  found_data.ctype_attr_value_part1 !== null
                  ? found_data.ctype_attr_value_part1
                  : ''
                  ) + (
                      found_data.ctype_attr_value_part2 !== null
                      ? found_data.ctype_attr_value_part2
                      : ''
                      );
            } else {
              // check subdata
              const found_subdata: CSampleSubData = sample.csample_subdata.find( (d: CSampleSubData) => {
                return d.ctype_sub_attr.parent_attr === key.toLowerCase();
              })
              if (found_subdata !== undefined) {
                displayed_sample[key] = (
                    found_subdata.ctype_sub_attr_value_part1 !== null
                    ? found_subdata.ctype_sub_attr_value_part1
                    : ''
                    ) + (
                        found_subdata.ctype_sub_attr_value_part2 !== null
                        ? found_subdata.ctype_sub_attr_value_part2
                        : ''
                        );
              } else {
                displayed_sample[key] = '';
              }
            }
          }
        })
        return displayed_sample;
    }
    // get all the subattrs and data
    genSubAttrData(sample: CSample): Array<Array<CSubAttrData>> {
        const subattr_data: Array<Array<CSubAttrData>> = new Array<Array<CSubAttrData>>();
        if (sample !== undefined && sample !== null
            && sample.ctype !== undefined && sample.ctype !== null
            && sample.ctype.type !== undefined && sample.ctype.type !== null
            && sample.csample_subdata !== undefined && sample.csample_subdata !== null) {
                const data_tables: Array<Array<Array<CSampleSubData>>> = new Array<Array<Array<CSampleSubData>>>();
                // get the table index
                const parent_attr_pks: Array<number> = new Array<number>();
                sample.csample_subdata.forEach((sd: CSampleSubData) => {
                    if (parent_attr_pks.indexOf(sd.ctype_sub_attr.parent_attr_id) === -1 ) {
                        parent_attr_pks.push(sd.ctype_sub_attr.parent_attr_id);
                    }
                })
                // loop into parent_attr_pks
                parent_attr_pks.forEach((p_pk: number) => {
                    const data_table: Array<Array<CSampleSubData>> = new Array<Array<CSampleSubData>>();
                    // get each sub atttr data
                    const pdata: Array<CSampleSubData> = sample.csample_subdata.filter((sd: CSampleSubData) => {
                        return sd.ctype_sub_attr.parent_attr_id === p_pk;
                    })
                    // get all the subattr_pk
                    const subattr_pks: Array<number> = new Array<number>();
                    pdata.forEach((item: CSampleSubData) => {
                        if (subattr_pks.indexOf(item.ctype_sub_attr_id) === -1) {
                            subattr_pks.push(item.ctype_sub_attr_id);
                        }
                    })
                    subattr_pks.forEach((s_pk: number) => {
                        const sdata: Array<CSampleSubData> = pdata.filter((item: CSampleSubData) => {
                            return item.ctype_sub_attr_id === s_pk;
                        })
                        data_table.push(sdata.sort(this.utilityService.sortArrayBySingleProperty('ctype_sub_attr_value_id')));
                    });
                    data_tables.push(data_table);
                });
                // get all the type complex attrs
                const all_complex_attrs: Array<CTypeAttr> = sample.ctype.attrs.filter((attr: CTypeAttr) => {
                    return attr.has_sub_attr && +attr.attr_value_type === 3;
                });
                // --------------------------------------------------------------------------------
                all_complex_attrs.forEach((pattr: CTypeAttr) => {
                    // get the table data of the ctypeattr
                    const data_table_index: number = data_tables.findIndex((titem: Array<Array<CSampleSubData>>) => {
                        const col = titem.find((item: Array<CSampleSubData>) => {
                            return item[0].ctype_sub_attr.parent_attr_id === pattr.pk;
                        })
                        return (col !== undefined  ? true : false);
                    })
                    if (data_table_index !== -1 ) {
                        // with data
                        if (pattr.subattrs.length > 0) {
                            pattr.subattrs.forEach((subattr: CTypeSubAttr) => {
                                const col: Array<CSampleSubData> = data_tables[data_table_index].find((item: Array<CSampleSubData>) => {
                                    return item.length > 0 && item[0].ctype_sub_attr_id === subattr.pk;
                                })
                                if (col === undefined) {
                                    // fake a empty col
                                    const new_col: Array<CSampleSubData> = new Array<CSampleSubData>();
                                    const new_col_data: CSampleSubData = new CSampleSubData();
                                    new_col_data.pk = null;
                                    new_col_data.csample_id = sample.pk;
                                    new_col_data.ctype_sub_attr_id = subattr.pk;
                                    new_col_data.ctype_sub_attr = subattr;
                                    new_col_data.ctype_sub_attr_value_id = 0;
                                    new_col_data.ctype_sub_attr_value_part1 = null;
                                    new_col_data.ctype_sub_attr_value_part2 = null;
                                    new_col.push(new_col_data);
                                    data_tables[data_table_index].push(new_col);
                                }
                            })
                        }
                    } else {
                        // no data
                        if (pattr.subattrs.length > 0) {
                            const data_table: Array<Array<CSampleSubData>> = new Array<Array<CSampleSubData>>();
                            pattr.subattrs.forEach((subattr: CTypeSubAttr) => {
                                // fake a empty col
                                const new_col: Array<CSampleSubData> = new Array<CSampleSubData>();
                                const new_col_data: CSampleSubData = new CSampleSubData();
                                new_col_data.pk = null;
                                new_col_data.csample_id = sample.pk;
                                new_col_data.ctype_sub_attr_id = subattr.pk;
                                new_col_data.ctype_sub_attr = subattr;
                                new_col_data.ctype_sub_attr_value_id = 0;
                                new_col_data.ctype_sub_attr_value_part1 = null;
                                new_col_data.ctype_sub_attr_value_part2 = null;
                                new_col.push(new_col_data);
                                data_table.push(new_col);
                            })
                            data_tables.push(data_table);
                        }
                    }
                })
                data_tables.forEach((data_table: Array<Array<CSampleSubData>>) => {
                    // for each table
                    const subattr_data_item: Array<CSubAttrData> = Array<CSubAttrData>();
                    // get the max data count
                    let max_count = 0;
                    data_table.forEach((col: Array<CSampleSubData>) => {
                        max_count = col.length - 1 >= max_count ? col.length - 1 : max_count;
                    })
                    data_table.forEach((col: Array<CSampleSubData>) => {
                        // for each col
                        const col_attrdata: CSubAttrData = new CSubAttrData();
                        // col attr
                        const col_attr: CTypeSubAttr = new CTypeSubAttr();
                        // col data
                        const col_subdata: Array<CSampleSubData> = new Array<CSampleSubData>();
                        // get attr
                        if (col.length > 0) {
                            col_attr.attr_label = col[0].ctype_sub_attr.attr_label;
                            col_attr.attr_name = col[0].ctype_sub_attr.attr_name;
                            col_attr.attr_order = col[0].ctype_sub_attr.attr_order;
                            col_attr.attr_required = col[0].ctype_sub_attr.attr_required;
                            col_attr.attr_value_decimal_point = col[0].ctype_sub_attr.attr_value_decimal_point;
                            col_attr.attr_value_decimal_total_digit = col[0].ctype_sub_attr.attr_value_decimal_total_digit;
                            col_attr.attr_value_text_max_length = col[0].ctype_sub_attr.attr_value_text_max_length;
                            col_attr.attr_value_type = col[0].ctype_sub_attr.attr_value_type;
                            col_attr.ctype_id = col[0].ctype_sub_attr.ctype_id;
                            col_attr.parent_attr = col[0].ctype_sub_attr.parent_attr;
                            col_attr.parent_attr_id = col[0].ctype_sub_attr.parent_attr_id;
                            col_attr.pk = col[0].ctype_sub_attr.pk;
                        }
                        // get data
                        if (col.length > 0) {
                            for (let i = 0; i <= max_count; i++) {
                                const item_data = col.find((sd: CSampleSubData) => {
                                    return sd.ctype_sub_attr_value_id !== null && sd.ctype_sub_attr_value_id === i;
                                })
                                const col_data_item: CSampleSubData = new CSampleSubData();
                                if (item_data !== undefined) {
                                    col_data_item.csample_id = item_data.csample_id;
                                    col_data_item.ctype_sub_attr_id = item_data.ctype_sub_attr_id;
                                    col_data_item.ctype_sub_attr_value_id = item_data.ctype_sub_attr_value_id;
                                    col_data_item.ctype_sub_attr_value_part1 = item_data.ctype_sub_attr_value_part1;
                                    col_data_item.ctype_sub_attr_value_part2 = item_data.ctype_sub_attr_value_part2;
                                    col_data_item.pk = item_data.pk;
                                } else {
                                    col_data_item.csample_id = sample.pk;
                                    col_data_item.ctype_sub_attr_id = col_attr.pk;
                                    col_data_item.ctype_sub_attr_value_id = i;
                                    col_data_item.ctype_sub_attr_value_part1 = null;
                                    col_data_item.ctype_sub_attr_value_part2 = null;
                                    col_data_item.pk = null;
                                }
                            col_subdata.push(col_data_item);
                            }
                        }
                        col_attrdata.sub_attr = Object.assign({}, col_attr);
                        col_attrdata.csample_subdata = Object.assign([], col_subdata);
                        subattr_data_item.push(col_attrdata);
                    })
                    subattr_data.push(subattr_data_item);
                })
        }
        return subattr_data;
    }
    // convert form values for saving
    formatCSample4Saving(posted_values: any, all_ctypes: Array<CType>): any {
        const obj = {};
        // csample attrs
        const csample_keys = ['ctype_pk', 'color', 'name', 'storage_date'];
        // convert sample
        const csample = {};
        csample['ctype_pk'] = +posted_values['ctype'];
        csample['color'] = posted_values['color'];
        csample['name'] = posted_values['name'];
        csample['storage_date'] = posted_values['storage_date'];
        obj['csample'] = csample;
        // get ctype
        const ctype: CType = all_ctypes.find((ct: CType) => { return ct.pk === +posted_values['ctype']; });
        if (ctype === undefined) {
            return false;
        }
        const keys = Object.keys(posted_values);
        // get attr with the subattr
        const complex_attrs: Array<CTypeAttr> = new Array<CTypeAttr>();
        ctype.attrs.forEach((attr: CTypeAttr) => {
            if (attr.has_sub_attr
                && attr.subattrs !== undefined
                && attr.subattrs !== null
                && attr.subattrs.length > 0 ) {
                complex_attrs.push(attr);
            }
        });
        // get all the attr with subattrs
        const complex_attr_names = complex_attrs.map((a: CTypeAttr) => { return a.attr_name; });
        // ---------------------------
        // get key without sub_attrs
        const attr_keys = keys.filter((k: string) => {
            return (
                k !== 'researchers' && k !== 'attachments' && k !== 'attachment'
                && csample_keys.indexOf(k) === -1
                && complex_attr_names.indexOf(k) === -1)
        });
        // campledata
        const csampledata = [];
        attr_keys.forEach((k: string) => {
            // build the obj
            const data = {};
            // get the attr
            const attr = ctype.attrs.find((a: CTypeAttr) => { return a.attr_name === k; })
            if (attr !== undefined) {
                // pk
                data['ctype_attr_id'] = attr.pk;
                // value id default 0
                data['ctype_attr_value_id'] = 0;
                // value
                data['ctype_attr_value_part1'] = posted_values[k];
                // append
                csampledata.push(data);
            }
        });
        obj['csampledata'] = csampledata;
        // ---------------------------------
        // get the keys with subattrs
        const complex_attr_keys = keys.filter((k: string) => {
            return (
                k !== 'researchers' && k !== 'attachments' && k !== 'attachment'
                && csample_keys.indexOf(k) === -1
                && complex_attr_names.indexOf(k) !== -1)
        });
        // csamplesubdata
        const csamplesubdata = [];
        complex_attr_keys.forEach((k: string) => {
            // get the attr
            const complex_attr = ctype.attrs
            .find((a: CTypeAttr) => { return a.has_sub_attr && a.attr_name === k; })
            if (complex_attr !== undefined) {
                const posted_data_array = posted_values[complex_attr.attr_name];
                if (isArray(posted_data_array) && posted_data_array.length > 0 ) {
                    // get pks for each keys
                    const sub_keys = Object.keys(posted_data_array[0]);
                    const pk_obj = {};
                    sub_keys.forEach((sk: string) => {
                        const sub_attr = complex_attr.subattrs.find((sa: CTypeSubAttr) => {
                            return sa.attr_name === sk;
                        })
                        if (sub_attr !== undefined) {
                            pk_obj[sk + '_pk'] = sub_attr.pk;
                        }
                    })
                    posted_data_array.forEach((ditem, i: number) => {
                        sub_keys.forEach((sk: string) => {
                            // build the obj
                            const data = {};
                            // pks
                            data['ctype_sub_attr_id'] = pk_obj[sk + '_pk']
                            // value id
                            data['ctype_sub_attr_value_id'] = i;
                            // value
                            data['ctype_sub_attr_value_part1'] = ditem[sk]
                            // append
                            csamplesubdata.push(data);
                        })
                    });
                }
            }
        });
        obj['csamplesubdata'] = csamplesubdata;
        return obj;
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
