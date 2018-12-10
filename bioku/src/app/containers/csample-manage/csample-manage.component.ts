import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CSample, CAttachment, CTypeAttr, MCTypeAttr, CSampleData,
  CSampleSubData, MCSampleSubData, CType, CSubAttrData, CTypeSubAttr, MCSubAttrData, MCTypeSubAttr } from '../../_classes/CType';
import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { AppStore } from '../../_providers/ReduxProviders';
import { CTypeService } from '../../_services/CTypeService';
import { UtilityService } from '../../_services/UtilityService';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Box } from 'app/_classes/Box';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { ContainerService } from '../../_services/ContainerService';
import { AlertService } from '../../_services/AlertService';
// color picker
import { IColorPickerConfiguration } from 'ng2-color-picker';
// mydatepicker
import {IMyOptions} from 'mydatepicker';
@Component({
  selector: 'app-csample-manage',
  templateUrl: './csample-manage.component.html',
  styleUrls: ['./csample-manage.component.css']
})
export class CsampleManageComponent implements OnInit, OnDestroy {
  loading = true;
  load_failed = false;
  require_refresh = false;
  // route param
  ct_pk: number;
  box_pos: string;
  sp_pos: string
  sp_pk: number
  private sub: any; // subscribe to params observable
  sample: CSample = new CSample();
  appUrl: string;
  container: Container = new Container();
  box: Box = new Box();
  display_sample: any = {};
  display_sample_copy: any = {};
  subattr_data: Array<Array<CSubAttrData>> = new Array<Array<CSubAttrData>>();
  msubattr_data: Array<Array<MCSubAttrData>> = new Array<Array<MCSubAttrData>>();
  // subattr_data_copy: Array<Array<CSubAttrData>> = new Array<Array<CSubAttrData>>();
  msubattr_data_copy: Array<Array<MCSubAttrData>> = new Array<Array<MCSubAttrData>>();
  attrs: Array<string> = new Array<string>(); // only labels
  ctype_attrs: Array<CTypeAttr> = new Array<CTypeAttr> ();
  // modified attr with changable tag
  // parent attr only
  mctype_attrs: Array<MCTypeAttr> = new Array<MCTypeAttr> ();
  // FOR RENDERING SAMPLE NAME
  SHOW_ORIGINAL_NAME = false;
  NAME_MIN_LENGTH: 15;
  NAME_MIN_right_LENGTH: 10;
  NAME_SYMBOL: '...';
  // color picker
  availableColors: Array<string> = [];
  pickerOptions: IColorPickerConfiguration = {
    width: 8,
    height: 8,
    borderRadius: 2};
  // attachment upload
  attachment_upload: Boolean = false;
  // attchment to delete
  // tslint:disable-next-line:no-inferrable-types
  attachment_to_delete: string = '';
  attachment_delete: Boolean = false;
  attachment_pk_to_delete: number = null;
  // upload
  // for attchment upload
  @ViewChild('attachmentLabel') attachmentLabelInput: ElementRef;
  @ViewChild('attachmentDescription') attachmentDescriptionInput: ElementRef;
  file: File;
  attchment_name: string;
  attchament_is2large: Boolean = false;
  attchament_error: Boolean = false;
  msg: string = null;
  date_attrs = {};
   // mydatepicker
  myDatePickerOptions: IMyOptions = {
    // other options...
    todayBtnTxt: 'Today',
    dateFormat: 'yyyy-mm-dd',
    height: '27px',
    width: '100%',
    openSelectorTopOfInput: true,
    showSelectorArrow: false,
    editableDateField: false,
    openSelectorOnInputClick: true};
  // validation object
  validations = {};
  // new subattr_data, will be clean upon submission
  add_subattr_data: Array<any> = new Array<any>();
  // will be clean upon submission
  add_validations = {};
  // add new subattr_data handler
  add_subattr_data_handler= {};
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private ctypeService: CTypeService,
  private containerService: ContainerService, private alertService: AlertService, private utilityService: UtilityService,
  private router: Router, private route: ActivatedRoute) {
    this.appUrl = this.appSetting.URL;
    this.SHOW_ORIGINAL_NAME = true;
    this.NAME_MIN_LENGTH = this.appSetting.NAME_MIN_LENGTH;
    this.NAME_MIN_right_LENGTH = this.appSetting.NAME_MIN_right_LENGTH;
    this.NAME_SYMBOL = this.appSetting.NAME_SYMBOL;
    this.availableColors = this.appSetting.APP_COLORS;
    // subscribe store state changes
    appStore.subscribe(() => this.updateState());
    this.updateState();
  }
  updateState() {
    const state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.currentBox) {
      this.box = state.containerInfo.currentBox;
    }
  }
  ngOnInit() {
    this.sub = this.route.params
    .mergeMap((params) => {
      this.load_failed = false;
      this.loading = true;
      this.ct_pk = +params['ct_pk'];
      this.box_pos = params['box_pos'];
      this.sp_pos = params['sp_pos']
      this.sp_pk = +params['sp_pk'];
      // should cal api to load the latest sample details ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // return this.containerService.sampleDetail(this.ct_pk, this.box_pos, this.sp_pos, this.sp_pk);
      return Observable.of(this.findSample(this.sp_pk));
    })
    .subscribe((sample: CSample) => {
      this.sample = sample;
      if (this.sample != null) {
        // get the ctype attrs for rendering
        this.ctype_attrs = this.ctypeService.genSampleCTypeAttrs(this.sample);
        this.attrs = this.ctypeService.genSampleAttrs(this.sample);
        this.display_sample = this.ctypeService.genDisplaySample(this.sample, this.attrs);
        this.display_sample_copy = Object.assign({}, this.display_sample);
        // modify ctype_attr and apply changable tag
        this.mctype_attrs = this.ctypeService.genMCTypeAttr(this.ctype_attrs);
        // console.log(this.mctype_attrs);
        this.subattr_data = this.ctypeService.genSubAttrData(this.sample);
        // console.log(this.subattr_data);
        // modify the subattr of subattr_data
        this.msubattr_data = this.ctypeService.genMSubAttrData(this.subattr_data);
        this.msubattr_data_copy = Object.assign({}, this.msubattr_data);
        // gen the hander
        this.msubattr_data.forEach((table_attrs: Array<MCSubAttrData>) => {
          // create empty data
          table_attrs.forEach((item: MCSubAttrData) => {
            const subattr_data_item: any = {};
            subattr_data_item.parent_attr_id = item.sub_attr.parent_attr_id;
            subattr_data_item.subattr_pk = item.sub_attr.pk;
            subattr_data_item.csample_pk = this.sample.pk;
            subattr_data_item.ctype_sub_attr_value_id = item.csample_subdata.length === 0 ? 0 : item.csample_subdata.length;
            subattr_data_item.value = null;
            this.add_subattr_data.push(subattr_data_item)
          })
          // toggle status
          this.add_validations[table_attrs[0].sub_attr.parent_attr + '_valid'] = false;
          this.add_subattr_data_handler[table_attrs[0].sub_attr.parent_attr] = false;
        });
        console.log(this.msubattr_data);
        // console.log(this.add_subattr_data);
      } else {
        this.load_failed = true;
        this.loading = false;
        this.alertService.error('Failed to load data! Please refresh this page or contact the support.', true);
      }
    },
    () => {
      this.load_failed = true;
      this.loading = false;
      this.alertService.error('Failed to load data! Please refresh this page or contact the support.', true);
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  findSample(pk: number) {
    let sample: CSample = new CSample();
    if (pk != null) {
      const samples = this.box.csamples.filter((s: CSample) => { return +pk === s.pk; });
      if (samples != null && samples.length === 1) {
        sample = samples[0]; }
    }
    return sample;
  }
  // ----------------------------------------------parental sample attr ------------------------------
  // presave sample
  // exlude color and attachments
  preSaveSampleData(value: any, attr: MCTypeAttr) {
    // validation
    this.validations[attr.attr_name] = this.utilityService.preSaveSampleDataValidation(value, attr);
    if (this.validations[attr.attr_name] === '') {
      if (attr.attr_value_type === 4) {
        // a date
        value = value.formatted;
        this.date_attrs[attr.attr_name] = value;
        this.display_sample_copy[attr.attr_label] = value;
      } else {
        this.display_sample_copy[attr.attr_label] = value;
      }
    }
  }
  performSaveCSample(attr: CTypeAttr, subattr: CTypeSubAttr, subdata: CSampleSubData) {
    // top level sample fix attr
    const fixed_sample_attrs = ['name', 'storage_date', 'color'];
    if (fixed_sample_attrs.indexOf(attr.attr_name) !== -1) {
      this.updateFixedSampleDetail(this.display_sample_copy[attr.attr_label],
        this.sample, this.sample.box_position, this.sample.position, attr.attr_label, attr.attr_name, attr.attr_required);
    } else {
      if ( !attr.has_sub_attr && attr.attr_value_type !== 3) {
          // top level ctype attrs
          this.updateCSampleData(this.display_sample_copy[attr.attr_label], this.sample, attr)
        }
    }
  }
  // update top level fixed attrs
  updateFixedSampleDetail(value: any, csample: CSample, box_position: string,
    sample_position: string, attr_label: string, attr_name: string, required: boolean) {
    // console.log('update sample details', csample);
    if ((value === '' || value === null) && required) {
      this.alertService.error(attr_name + ' is required!', false);
    } else {
      this.containerService
      .updateSampleDetail(this.container.pk, box_position, sample_position, attr_name, value)
      .subscribe(() => {
        // update display_sample
        this.display_sample[attr_label] = value;
        this.display_sample_copy[attr_label] = value;
        this.toggleChangePostSave(attr_name);
        this.require_refresh = true;
      }, (err) => {
        this.alertService.error('fail to update sample detail!', false); });
    }
  }
  // update top level csample data
  updateCSampleData(value: any, csample: CSample, attr: CTypeAttr) {
      if (attr.attr_required && (value === '' || value == null) ) {
        this.alertService.error(attr.attr_label + ' is required!', false);
      } else {
        this.containerService
        .updateCSampleData(this.container.pk, csample.box_position, this.sample.position, csample.pk, attr.pk, value)
        .subscribe(() => {
          // update display_sample
          this.display_sample[attr.attr_label] = value;
          this.display_sample_copy[attr.attr_name] = value;
          this.toggleChangePostSave(attr.attr_name);
          this.require_refresh = true;
          }, (err) => {
          this.alertService.error('fail to update sample detail!', false); });
      }
  }

  // update display_sample for subattr data
  synDisplaySubData(value: any, attr: CTypeAttr, subattr: CTypeSubAttr, subdata: CSampleSubData) {
    this.subattr_data.forEach((sd: Array<CSubAttrData>) => {
          sd.forEach((item: CSubAttrData) => {
            if (item.sub_attr.pk === subattr.pk) {
              item.csample_subdata.forEach((ditem: CSampleSubData) => {
                if (ditem.ctype_sub_attr_value_id === subdata.ctype_sub_attr_value_id ) {
                  ditem.ctype_sub_attr_value_part1 = value;
                }
              })
            }
          });
    });
    // update the copy
    this.msubattr_data = this.ctypeService.genMSubAttrData(this.subattr_data);
    this.msubattr_data_copy = Object.assign({}, this.msubattr_data);
  }

  // route force refrsh
  forceRefresh() {
    this.router.navigate(['/containers', this.container.pk], { queryParams: { 'box_position': this.box.box_position } });
  }
  renderSampleName(sampleName: string) {
    return this.utilityService.renderSampleName(sampleName, this.SHOW_ORIGINAL_NAME,
      this.NAME_MIN_LENGTH, this.NAME_MIN_right_LENGTH, this.NAME_SYMBOL);
  }
  // toggle change status
  toggleChange(attr: CTypeAttr) {
    this.mctype_attrs.forEach((mattr: MCTypeAttr) => {
      if (mattr.pk === attr.pk) {
        mattr.is_changing = !mattr.is_changing;
        // restore date
        // this.display_sample_copy[attr.attr_label] = this.display_sample[attr.attr_label];
      }
    });
  }
  toggleChangePostSave(attr_name: string) {
    this.mctype_attrs.forEach((mattr: MCTypeAttr) => {
      if (mattr.attr_name === attr_name) {
        mattr.is_changing = !mattr.is_changing;
        this.display_sample[attr_name] = this.display_sample_copy[attr_name];
      }
    });
  }
  // ---------------------------------subdata change----------------------------
  toggleSubdataDeletion(table_index: number, data_index: number) {
    this.msubattr_data[table_index].forEach((row: MCSubAttrData) => {
      row.csample_subdata[data_index].is_deleting = !row.csample_subdata[data_index].is_deleting;
    })
  }
  // deletion
  performSubdataDeletion(table_index: number, data_index: number) {
    // get all the pks to delete
    const pks: Array<number> = new Array<number>();
    this.msubattr_data[table_index].forEach((row: MCSubAttrData, attr_index: number) => {
      pks.push(row.csample_subdata[data_index].pk);
    })
    if (pks.length > 0) {
      // save
      this.containerService.
      deleteCSampleSubData(this.container.pk, this.box.box_position, this.sample.position, this.sample.pk, pks)
      .subscribe(() => {
        // // delete from msubattr_data
        this.msubattr_data = this.ctypeService.syncSubAttrDataDeletion(this.msubattr_data, pks);
        this.msubattr_data_copy = Object.assign({}, this.msubattr_data);
        this.require_refresh = true;
      },
      () => {
        this.alertService.error('Something went wrong, failed to delete the data!', false);
      });
    } else {
      this.alertService.error('Something went wrong, nothing to delete!', false);
    }
  }
  toggleSubdataChange(table_index: number, data_index: number) {
    this.msubattr_data[table_index].forEach((row: MCSubAttrData, attr_index: number) => {
      row.csample_subdata[data_index].is_changing = !row.csample_subdata[data_index].is_changing;
    })
  }
  performSubdataChange(table_index: number, data_index: number) {
    // get the data
    const data: Array<any> = new Array<any>();
    this.msubattr_data_copy[table_index].forEach((subattr_data: MCSubAttrData) => {
      const item: any = {};
      item.pk = subattr_data.csample_subdata[data_index].pk;
      item.value = subattr_data.csample_subdata[data_index].ctype_sub_attr_value_part1;
      data.push(item);
    })
    if (data.length > 0 ) {
      // save
      this.containerService.
      updateCSampleSubAttrBatchData(this.container.pk, this.box.box_position, this.sample.position, this.sample.pk, data)
      .subscribe(() => {
        // update from the copy
        this.msubattr_data = Object.assign({}, this.msubattr_data_copy);
        // toggle change
        this.toggleSubdataChange(table_index, data_index);
        this.require_refresh = true;
      },
      () => {
        this.alertService.error('Something went wrong, failed to update the data!', false);
      });
    } else {
      this.alertService.error('Something went wrong, nothing to update!', false);
    }
  }
  preSaveSampleSubData(value: any, table_index: number, attr_index: number, data_index: number) {
    // get the sub_attr
    const sub_attr = this.msubattr_data_copy[table_index][attr_index].sub_attr;
    // validation
    if ( !(sub_attr.parent_attr + '_' + data_index + '_valid' in this.validations)) {
      this.validations[sub_attr.parent_attr + '_' + data_index  + '_valid'] = false;
    }
    this.validations[sub_attr.parent_attr  + '_' + data_index + '_' + sub_attr.attr_name]
    = this.utilityService.preSaveSampleDataValidation(value, sub_attr);
    if (this.validations[sub_attr.parent_attr + '_' + data_index + '_' + sub_attr.attr_name] === '') {
      if (sub_attr.attr_value_type === 4) {
        // a date
        value = value.formatted;
        this.date_attrs[sub_attr.parent_attr + '_' + data_index + '_' + sub_attr.attr_name] = value;
        this.msubattr_data_copy[table_index][attr_index].csample_subdata[data_index].ctype_sub_attr_value_part1 = value;
      } else {
        this.msubattr_data_copy[table_index][attr_index].csample_subdata[data_index].ctype_sub_attr_value_part1 = value;
      }
    } else {
      if (this.validations[sub_attr.parent_attr + '_' + data_index  + '_valid']) {
        this.validations[sub_attr.parent_attr + '_' + data_index  + '_valid'] = false;
      }
    }
  }
  toggleAddSubAttrData(parent_attr: string) {
    if ((parent_attr in this.add_subattr_data_handler)) {
      this.add_subattr_data_handler[parent_attr] = !this.add_subattr_data_handler[parent_attr];
    }
  }
  preAddSampleSubData(value: any, sub_attr: MCTypeSubAttr, table_index: number) {
    // validate
    const subattr_name = sub_attr.parent_attr + '_' + sub_attr.attr_name;
    this.add_validations[subattr_name] = this.utilityService.preSaveSampleDataValidation(value, sub_attr);
    // update data
    this.add_subattr_data.forEach((item: any) => {
      if (item.parent_attr_id === sub_attr.parent_attr_id
        && item.subattr_pk === sub_attr.pk) {
          if (sub_attr.attr_value_type === 4) {
            item.value = value.formatted;
          } else {
            item.value = value;
          }
        }
    })
    // validation the whole subattr
    this.add_validations[sub_attr.parent_attr + '_valid']
    = this.utilityService.checkSampleTotalSubDataValidation(this.add_subattr_data, this.msubattr_data[table_index]);
  }
  performAddSubAttrData(table_index: number) {
    // get the data
    const parent_attr_id = this.msubattr_data[table_index][0].sub_attr.parent_attr_id;
    const parent_attr = this.msubattr_data[table_index][0].sub_attr.parent_attr;
    const data: Array<any> = this.add_subattr_data.filter((item: any) => {
      return item.parent_attr_id === parent_attr_id;
    });
    if (data.filter((item: any) => { return item.value !== null && item.value !== ''}).length === 0) {
      this.alertService.error('Something went wrong, nothing to save!', false);
    }
    this.containerService
    .addCSampleSubAttrBatchData(this.container.pk, this.sample.box_position, this.sample.position, this.sample.pk, data)
    .subscribe((rdata: Array<CSampleSubData>) => {
      // sync data
      this.appendCSampleSubData(table_index, rdata);
      this.add_validations[parent_attr + '_valid'] = false;
      this.add_subattr_data_handler[parent_attr] = false;
    },
    (err) => {
      console.log(err);
      this.alertService.error('Something went wrong, failed to save data!', false);
      // this.add_validations[parent_attr + '_valid'] = false;
      this.add_subattr_data_handler[parent_attr] = false;
    });
  }
  // append new subdata
  appendCSampleSubData(table_index: number, data: Array<CSampleSubData>) {
    this.msubattr_data[table_index].forEach((subdata: MCSubAttrData) => {
      const item: MCSampleSubData = new MCSampleSubData();
      const data_item: CSampleSubData = data.find((di: CSampleSubData) => {
        return di.pk === subdata.sub_attr.pk;
      });
      if (data_item !== undefined) {
        item.is_changing = false;
        item.is_deleting = false;
        item.csample_id = data_item.csample_id;
        item.ctype_sub_attr = data_item.ctype_sub_attr;
        item.ctype_sub_attr_id = data_item.ctype_sub_attr_id;
        item.ctype_sub_attr_value_id = data_item.ctype_sub_attr_value_id;
        item.ctype_sub_attr_value_part1 = data_item.ctype_sub_attr_value_part1;
        item.ctype_sub_attr_value_part2 = data_item.ctype_sub_attr_value_part2;
        subdata.csample_subdata.push(item);
      }
    })
  }
  // ---------------------------------- attachment --------------------------
  displayAttachmentUpload() {
    this.attachment_upload = true;
    this.cancelAttachmentDelete();
  }

  hideAttachmentUpload() {
    this.attachment_upload = false;
    this.file = null;
    this.attchment_name = null;
    this.attchament_is2large = false;
  }

  attachment2Delete(attachment_pk: number, attachment_name: string) {
    this.attachment_delete = true;
    this.attachment_pk_to_delete = attachment_pk;
    this.attachment_to_delete = attachment_name;
    // clear the attachment upload
    this.hideAttachmentUpload();
  }

  cancelAttachmentDelete() {
    this.attachment_delete = false;
    this.attachment_pk_to_delete = null;
    this.attachment_to_delete = '';
  }

  performAttachmentDelete() {
    this.containerService.deleteAttachment(this.sample.pk, this.attachment_pk_to_delete)
        .subscribe(() => {
          // update sample view
          this.updateSampleAttchmentDeletion(this.attachment_pk_to_delete);
          this.cancelAttachmentDelete();
          this.hideAttachmentUpload();
          this.alertService.success('the attchament removed!', true);
          this.require_refresh = true;
        }, () => {
          // tslint:disable-next-line:quotemark
          this.alertService.error("failed to delete sample attachments!", true);
        });
  }

  // remove attachments of the sample after ajax call
  updateSampleAttchmentDeletion(attachment_pk_to_delete: number) {
    if (attachment_pk_to_delete != null) {
      this.display_sample.ATTACHMENTS = [...this.display_sample.ATTACHMENTS.filter(a => { return a.pk !== attachment_pk_to_delete})];
      this.display_sample_copy = Object.assign({}, this.display_sample);
    }
  }
  // uploaded after ajax call
  updateSampleAttchmentUpload(attachment: CAttachment) {
    if (attachment != null) {
      this.display_sample.ATTACHMENTS = [...this.display_sample.ATTACHMENTS, attachment];
      this.display_sample_copy = Object.assign({}, this.display_sample);
    }
  }
  // check upload attachment
  validateAttachmentUpload(event: EventTarget) {
    const eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    const target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    this.attchament_is2large = false;
    this.attchament_error = false;
    const files: FileList = target.files;
    this.file = files[0];
    // console.log(this.file);
    this.attchment_name = this.file.name;
    // check file size
    const size = this.file.size / 1024 / 1024
    if (parseInt(size.toFixed(2), 10) > 10) {
        this.attchament_is2large = true;
    } else {
      this.attchament_is2large = false;
    }
  }

  // perform upload
  performAttachmentUpload() {
    // attachment info
    const label = this.attachmentLabelInput.nativeElement.value
    const description = this.attachmentDescriptionInput.nativeElement.value;
    if (!this.file || label === '') {
      // if attachment or lable is null
      this.attchament_error = true;
    } else {
      const obj = {
        'label': label,
        'description': description
      }
      const formData: FormData = new FormData();
      formData.append('obj', JSON.stringify(obj));
      if (this.file) {
        formData.append('file', this.file, this.file.name);
      }
      // post call
      this.containerService.uploadSampleAttachment(formData, this.sample.pk)
      .map(data => data.json())
      .subscribe(
        (data: CAttachment) => {
          // console.log(data);
          // update sample attachment//need to return the sample object
          this.updateSampleAttchmentUpload(data);
          this.hideAttachmentUpload();
          this.alertService.success('the attchament uploaded!', true);
          this.require_refresh = true;
        },
        () => this.alertService.error('something went wrong, the attchament not uploaded!', true)
      );
    }
  }
}
