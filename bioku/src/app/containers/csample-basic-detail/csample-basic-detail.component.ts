import { Component, OnInit, OnChanges, Inject, Input, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { ContainerService } from '../../_services/ContainerService';
import { AlertService } from '../../_services/AlertService';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType, CSubAttrData } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import {  UtilityService } from '../../_services/UtilityService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
// color picker
import { IColorPickerConfiguration } from 'ng2-color-picker';

@Component({
  selector: 'app-csample-basic-detail',
  templateUrl: './csample-basic-detail.component.html',
  styleUrls: ['./csample-basic-detail.component.css']
})
export class CsampleBasicDetailComponent implements OnInit, OnChanges {
  @Input() samplePK: number;
  sample: CSample = new CSample();
  user: User;
  appUrl: string;
  @Input() container: Container = null;
  @Input() box: Box = null;
  action_panel_msg: string= null;
  display_sample: any = {};
  attrs: Array<string> = new Array<string>();
  subattr_data: Array<Array<CSubAttrData>> = new Array<Array<CSubAttrData>>();
  // FOR RENDERING SAMPLE NAME
  SHOW_ORIGINAL_NAME: false;
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
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private ctypeService: CTypeService,
  private containerService: ContainerService, private alertService: AlertService, private utilityService: UtilityService,
  private router: Router, private route: ActivatedRoute) {
    this.appUrl = this.appSetting.URL;
    this.SHOW_ORIGINAL_NAME = this.appSetting.SHOW_ORIGINAL_NAME;
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
    if (state.authInfo && state.authInfo.authUser) {
      this.user = state.authInfo.authUser;
    }
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.currentBox) {
      this.box = state.containerInfo.currentBox;
    }
  }
  ngOnInit() {}
  ngOnChanges() {
    if (this.samplePK != null) {
      this.sample = this.findSample(this.samplePK);
      this.attrs = this.ctypeService.genSampleAttrs(this.sample);
      this.display_sample = this.ctypeService.genDisplaySample(this.sample, this.attrs);
      this.subattr_data = this.ctypeService.genSubAttrData(this.sample);
    }
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
  // route force refrsh
  forceRefresh() {
    this.router.navigate(['/containers', this.container.pk], { queryParams: { 'box_position': this.box.box_position } });
  }
  renderSampleName(sampleName: string) {
    return this.utilityService.renderSampleName(sampleName, this.SHOW_ORIGINAL_NAME,
      this.NAME_MIN_LENGTH, this.NAME_MIN_right_LENGTH, this.NAME_SYMBOL);
  }
  // take or put sample back
  // need to fix the issue here
  takeSingleSampleOut(box_position: string, csample: CSample, sample_position: string) {
    this.action_panel_msg = null;
    // get today
    const today = new Date()
    const date_out = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    csample.date_out = today;
    csample.occupied = false;
    this.containerService.takeSampleOut(this.container.pk, box_position, sample_position)
    .subscribe(() => {
      this.alertService.success('sample at: ' + sample_position + ' is token out!', true);
      this.forceRefresh();
    }, (err) => {
      // tslint:disable-next-line:quotemark
      this.alertService.error('Something went wrong, failed to take out the sample at: ' + sample_position + '!', true);
      this.forceRefresh();
    });
  }

  // put single sample back
  putSingleSampleBack(box_position: string, csample: CSample, sample_position: string) {
    this.action_panel_msg = null;
    const today = new Date()
    const date_out = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    csample.date_out = null;
    csample.occupied = true;
    this.containerService.putSampleBack(this.container.pk, box_position, sample_position)
    .subscribe(() => {
      // tslint:disable-next-line:quotemark
      this.alertService.success('sample at: ' + sample_position + ' is put back!', true);
      this.forceRefresh();
    }, (err) => {
      this.alertService.error('Something went wrong, failed to put back the sample at: '
      + sample_position + '! The slot could have been occupied, try to move the sample instead!', true);
      this.forceRefresh();
    });
  }

  updateSampleDetail(value: any, csample: CSample, box_position: string, sample_position: string, data_attr: string, required: boolean) {
    console.log('update sample details', csample);
    this.action_panel_msg = null;
    if ((value === '' || value == null) && required) {
      this.action_panel_msg = data_attr + ' is required!'
    } else {
      this.action_panel_msg = null;
      // sample.storage_date
      if (data_attr === 'storage_date') {
        value = value.formatted;
        csample.storage_date =  value;
      }
      this.containerService
      .updateSampleDetail(this.container.pk, box_position, sample_position, data_attr, value)
      .subscribe(() => {}, (err) => console.log(this.action_panel_msg = 'fail to update sample detail!'));
    }
  }

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
    }
  }
  // uploaded after ajax call
  updateSampleAttchmentUpload(attachment: CAttachment) {
    if (attachment != null) {
      this.display_sample.ATTACHMENTS = [...this.display_sample.ATTACHMENTS, attachment];
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
