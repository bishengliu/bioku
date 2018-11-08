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
import { CType, CTypeAttr, CTypeSubAttr, CSample, CSampleData, CSampleSubData, CSubAttrData} from '../_classes/CType';
import { Sample, Attachment } from '../_classes/Sample';
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
                        pk: -1, // no pk
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
                        pk: -1, // no pk
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
                        pk: -1, // no pk
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
                        pk: -1, // no pk
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
                        pk: -1, // no pk
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
                        pk: -1, // no pk
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
              displayed_sample[key] = found_data.ctype_attr_value_part1 + found_data.ctype_attr_value_part2;
            } else {
              // check subdata
              const found_subdata: CSampleSubData = sample.csample_subdata.find( (d: CSampleSubData) => {
                return d.ctype_sub_attr.parent_attr === key.toLowerCase();
              })
              if (found_subdata !== undefined) {
                displayed_sample[key] = found_subdata.ctype_sub_attr_value_part1 + found_subdata.ctype_sub_attr_value_part2;
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
                sample.csample_subdata.forEach((sd: CSampleSubData) => {
                    const data_index = subattr_data.findIndex((data: Array<CSubAttrData>) => {
                        return data[0] !== null
                        && data[0] !== undefined
                        && (data[0].sub_attr.parent_attr_id === sd.ctype_sub_attr.parent_attr_id);
                    })
                    if ( data_index === -1) {
                        const subattr_data_item: Array<CSubAttrData> = Array<CSubAttrData>();
                        const subdata: CSubAttrData = new CSubAttrData();
                        const sub_attr: CTypeSubAttr = new CTypeSubAttr();
                        sub_attr.attr_label = sd.ctype_sub_attr.attr_label;
                        sub_attr.attr_name = sd.ctype_sub_attr.attr_name;
                        sub_attr.attr_order = sd.ctype_sub_attr.attr_order;
                        sub_attr.attr_required = sd.ctype_sub_attr.attr_required;
                        sub_attr.attr_value_decimal_point = sd.ctype_sub_attr.attr_value_decimal_point;
                        sub_attr.attr_value_decimal_total_digit = sd.ctype_sub_attr.attr_value_decimal_total_digit;
                        sub_attr.attr_value_text_max_length = sd.ctype_sub_attr.attr_value_text_max_length;
                        sub_attr.attr_value_type = sd.ctype_sub_attr.attr_value_type;
                        sub_attr.ctype_id = sd.ctype_sub_attr.ctype_id;
                        sub_attr.parent_attr = sd.ctype_sub_attr.parent_attr;
                        sub_attr.parent_attr_id = sd.ctype_sub_attr.parent_attr_id;
                        sub_attr.pk = sd.ctype_sub_attr.pk;
                        const csample_subdata: Array<CSampleSubData> = new Array<CSampleSubData>();
                        const csample_subdata_item: CSampleSubData = new CSampleSubData();
                        csample_subdata_item.csample_id = sd.csample_id;
                        csample_subdata_item.ctype_sub_attr_id = sd.ctype_sub_attr_id;
                        csample_subdata_item.ctype_sub_attr_value_part1 = sd.ctype_sub_attr_value_part1;
                        csample_subdata_item.ctype_sub_attr_value_part2 = sd.ctype_sub_attr_value_part2;
                        csample_subdata_item.pk = sd.pk;
                        csample_subdata.push(csample_subdata_item);
                        subdata.sub_attr = Object.assign({}, sub_attr);
                        subdata.csample_subdata = Object.assign([], csample_subdata);
                        subattr_data_item.push(subdata);
                        subattr_data.push(subattr_data_item);
                    } else {
                        const subdata_index = subattr_data[data_index].findIndex((data: CSubAttrData) => {
                            return data.sub_attr.pk === sd.pk && data.sub_attr.parent_attr_id === sd.ctype_sub_attr.parent_attr_id;
                        })
                        if (subdata_index !== -1) {
                            const csample_subdata_item: CSampleSubData = new CSampleSubData();
                            csample_subdata_item.csample_id = sd.csample_id;
                            csample_subdata_item.ctype_sub_attr_id = sd.ctype_sub_attr_id;
                            csample_subdata_item.ctype_sub_attr_value_part1 = sd.ctype_sub_attr_value_part1;
                            csample_subdata_item.ctype_sub_attr_value_part2 = sd.ctype_sub_attr_value_part2;
                            csample_subdata_item.pk = sd.pk;
                            subattr_data[data_index][subdata_index].csample_subdata.push(csample_subdata_item);
                        } else {
                            const subdata: CSubAttrData = new CSubAttrData();
                            const sub_attr: CTypeSubAttr = new CTypeSubAttr();
                            sub_attr.attr_label = sd.ctype_sub_attr.attr_label;
                            sub_attr.attr_name = sd.ctype_sub_attr.attr_name;
                            sub_attr.attr_order = sd.ctype_sub_attr.attr_order;
                            sub_attr.attr_required = sd.ctype_sub_attr.attr_required;
                            sub_attr.attr_value_decimal_point = sd.ctype_sub_attr.attr_value_decimal_point;
                            sub_attr.attr_value_decimal_total_digit = sd.ctype_sub_attr.attr_value_decimal_total_digit;
                            sub_attr.attr_value_text_max_length = sd.ctype_sub_attr.attr_value_text_max_length;
                            sub_attr.attr_value_type = sd.ctype_sub_attr.attr_value_type;
                            sub_attr.ctype_id = sd.ctype_sub_attr.ctype_id;
                            sub_attr.parent_attr = sd.ctype_sub_attr.parent_attr;
                            sub_attr.parent_attr_id = sd.ctype_sub_attr.parent_attr_id;
                            sub_attr.pk = sd.ctype_sub_attr.pk;
                            const csample_subdata: Array<CSampleSubData> = new Array<CSampleSubData>();
                            const csample_subdata_item: CSampleSubData = new CSampleSubData();
                            csample_subdata_item.csample_id = sd.csample_id;
                            csample_subdata_item.ctype_sub_attr_id = sd.ctype_sub_attr_id;
                            csample_subdata_item.ctype_sub_attr_value_part1 = sd.ctype_sub_attr_value_part1;
                            csample_subdata_item.ctype_sub_attr_value_part2 = sd.ctype_sub_attr_value_part2;
                            csample_subdata_item.pk = sd.pk;
                            csample_subdata.push(csample_subdata_item);
                            subdata.sub_attr = Object.assign({}, sub_attr);
                            subdata.csample_subdata = Object.assign([], csample_subdata);
                            subattr_data[data_index].push(subdata)
                        }
                    }
                });
        }
        return subattr_data;
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
