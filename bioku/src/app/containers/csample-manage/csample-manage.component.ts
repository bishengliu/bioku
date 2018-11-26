import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CSample, CAttachment, CTypeAttr, MCTypeAttr, CSampleData,
  CSampleSubData, CType, CSubAttrData, CTypeSubAttr } from '../../_classes/CType';
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
  subattr_data_copy: Array<Array<CSubAttrData>> = new Array<Array<CSubAttrData>>();
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
  storage_date: string = null;
   // mydatepicker
  myDatePickerOptions: IMyOptions = {
    // other options...
    todayBtnTxt: 'Today',
    dateFormat: 'yyyy-mm-dd',
    openSelectorTopOfInput: true,
    showSelectorArrow: false,
    editableDateField: false,
    openSelectorOnInputClick: true};
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
        console.log(this.display_sample);
        // modify ctype_attr and apply changable tag
        this.mctype_attrs = this.ctypeService.applyCTypeAttrChangableTag(this.ctype_attrs);
        this.subattr_data = this.ctypeService.genSubAttrData(this.sample);
        this.subattr_data_copy = Object.assign({}, this.subattr_data);
        console.log(this.subattr_data);
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
  // presave sample
  // exlude color and attachments
  preSaveSampleData(value: any, attr: CTypeAttr) {
    // validation
    // ==============================================================
    // console.log(this.display_sample_copy);
    if (attr.attr_value_type === 4) {
      // a date
      value = value.formatted;
      this.storage_date = value;
      this.display_sample_copy[attr.attr_label] = value;
    } else {
      this.display_sample_copy[attr.attr_label] = value;
    }
  }
  performSaveCSample(attr: CTypeAttr, subattr: CTypeSubAttr, subdata: CSampleSubData) {
    // top level sample fix attr
    const fixed_sample_attrs = ['name', 'storage_date', 'color'];
    if (fixed_sample_attrs.indexOf(attr.attr_name) !== -1) {
      this.updateFixedSampleDetail(this.display_sample_copy[attr.attr_label],
        this.sample, this.sample.box_position, this.sample.position, attr.attr_label, attr.attr_name, attr.attr_required);
    } else if ( !attr.has_sub_attr
      && attr.attr_value_type === 3
      && Array.isArray(attr.subattrs)
      && attr.subattrs.length > 0) {
        // top level ctype attrs
        this.updateCSampleData(this.display_sample_copy[attr.attr_label], this.sample, attr)
      } else {
        // sub attrs, complext attrs
        this.updateCSampleSubData(this.display_sample_copy[attr.attr_label], this.sample, attr, subattr, subdata)
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
        // need to dispatch to the redux box sample ------------------ ===================================================================================================
        this.toggleChangePostSave(attr_name);
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
        .updateCSampleData(this.container.pk, csample.box_position, csample.position, attr.pk, value)
        .subscribe(() => {
          // update display_sample
          this.display_sample[attr.attr_name] = value;
          this.display_sample_copy[attr.attr_name] = value;
          this.toggleChangePostSave(attr.attr_name);
          }, (err) => {
          console.log(
          this.msg = 'fail to update sample detail!')
          this.alertService.error('fail to update sample detail!', false); });
      }
  }
  // update csamplesubdata
  updateCSampleSubData(value: any, csample: CSample, attr: CTypeAttr, subattr: CTypeSubAttr, subdata: CSampleSubData) {
    if (subattr.attr_required && (value === '' || value == null) ) {
      this.alertService.error(subattr.attr_label + ' of' + attr.attr_label + ' is required!', false);
    } else {
      this.containerService
      .updateCSampleSubData(this.container.pk, csample.box_position, csample.position, attr.pk, subattr.pk, value)
      .subscribe(() => {
        // need to dispatch to the redux box sample ------------------ ===================================================================================================
        // update display_sample
        this.synDisplaySubData(value, attr, subattr, subdata);
        // need hide the box for editing
        }, (err) => {
        console.log(
        this.msg = 'fail to update sample detail!')
        this.alertService.error('fail to update sample detail!', false); });
    }
  }
  // need to add or remove subdata

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
    this.subattr_data_copy = Object.assign({}, this.subattr_data);
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
        },
        () => this.alertService.error('something went wrong, the attchament not uploaded!', true)
      );
    }
  }
}
