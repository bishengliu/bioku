import { Component, OnInit, OnChanges, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { Attachment } from '../../_classes/Sample';
import { ContainerService } from '../../_services/ContainerService';
import { AlertService } from '../../_services/AlertService';
import { LocalStorageService } from '../../_services/LocalStorageService';
// mydatepicker
import {IMyOptions} from 'mydatepicker';
// color picker
import { IColorPickerConfiguration } from 'ng2-color-picker';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
@Component({
  selector: 'app-sample-detail',
  templateUrl: './sample-detail.component.html',
  styleUrls: ['./sample-detail.component.css']
})
export class SampleDetailComponent implements OnInit, OnChanges {
  @Input() samplePK: number;
  sample: Sample = new Sample();
  // SAPMPLE TYPE
  // tslint:disable-next-line:no-inferrable-types
  sample_type: string = 'GENERAL';
  // ALL SAMPLE TYPES
  all_sample_types: Array<String> = new Array<String>();
  user: User;
  appUrl: string;
  @Input() container: Container = null;
  @Input() box: Box = null;
  freezing_date = {}; // for only select one sample
  action_panel_msg: string= null;
  // Box position letters
  box_letters: Array<string> = [];
  // box hposition
  box_hposition: Boolean = false;
  // mydatepicker
  myDatePickerOptions: IMyOptions = {
        // other options...
        todayBtnTxt: 'Today',
        dateFormat: 'yyyy-mm-dd',
        openSelectorTopOfInput: true,
        showSelectorArrow: false,
        editableDateField: false,
        openSelectorOnInputClick: true};

  // color picker
  availableColors: Array<string> = [];
  pickerOptions: IColorPickerConfiguration = {
    width: 8,
    height: 8,
    borderRadius: 2};
  // selection options
  vertical_options = [];
  horizontal_options = [];
  // loader
  action_loader: Boolean = false;
  // view child
  @ViewChild('vposition') vposition: ElementRef;
  @ViewChild('hposition') hposition: ElementRef;

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
  // CUSTOM SAMPEL CODE NAME
  custom_sample_code_name = 'sample code';
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private containerService: ContainerService, private alertService: AlertService,
              private router: Router, private route: ActivatedRoute) {
    this.appUrl = this.appSetting.URL;
    this.availableColors = this.appSetting.APP_COLORS;
    this.box_letters = this.appSetting.BOX_POSITION_LETTERS;
    this.all_sample_types = this.appSetting.SAMPLE_TYPE;
    this.custom_sample_code_name = this.appSetting.CUSTOM_SAMPLE_CODE_NAME.toLowerCase();
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

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.samplePK != null) {
      this.sample = this.findSample(this.samplePK);
      if (this.sample != null) {
        this.freezing_date = this.parseFreezingDate(this.sample.freezing_date.toString());
        this.vertical_options = this.renderOptions(this.box.box_vertical, true);
        this.horizontal_options = this.renderOptions(this.box.box_horizontal, false);
        if (this.sample.type != null) {
          this.sample_type = this.all_sample_types.indexOf(this.sample.type) !== -1 ? this.sample.type : 'GENERAL';
        } else {
          this.sample_type = 'GENERAL';
        }
      }
    }
  }

  findSample(pk: number) {
    let sample: Sample = new Sample();
    if (pk != null) {
      const samples = this.box.samples.filter((s: Sample) => { return +pk === s.pk; });
      if (samples != null && samples.length === 1) {
        sample = samples[0];
      }
    }
    return sample;
  }

  renderOptions(count: number, letter: boolean) {
    const options = [];
    options.push({name: '-', value: null});
    for (let i = 1; i <= count; i++) {
      const obj = letter ? {name: this.box_letters[i - 1], value: this.box_letters[i - 1]} : {name: i, value: i};
      options.push(obj)
    }
    return options;
  }

  parseFreezingDate(date: string) {
    let freezing_date = {};
    if (date) {
      const dArray = date.split('-');
      freezing_date = { date: {year: +dArray[0], month: +dArray[1], day: +dArray[2]} }; }
    return freezing_date;
  }

  // route force refrsh
  forceRefresh() {
    this.router.navigate(['/containers', this.container.pk], { queryParams: { 'box_position': this.box.box_position } });
  }

  display_hposition() {
    if (this.vposition.nativeElement.value == null || this.vposition.nativeElement.value === '') {
      this.box_hposition = false;
    } else {
      if (this.hposition) {
        this.hposition.nativeElement.value = null;
      }
      this.box_hposition = true;
    }
  }

  updateSampleDetail(value: any, sample: Sample, box_position: string, sample_position: string, data_attr: string, required: boolean) {
    // console.log('update sample details', sample);
    this.action_panel_msg = null;
    if ((value === '' || value == null) && required) {
      this.action_panel_msg = data_attr + ' is required!'
    } else {
      this.action_panel_msg = null;
      // sample.freezing_date
      if (data_attr === 'freezing_date') {
        value = value.formatted;
        sample.freezing_date =  value;
      }
      this.containerService.updateSampleDetail(this.container.pk, box_position, sample_position, data_attr, value)
          .subscribe(() => {}, (err) => console.log(this.action_panel_msg = 'fail to update sample detail!'));
    }
  }

  updateSamplePosition(sample: Sample, box_position: string, sample_position: string) {
    this.action_panel_msg = null;
    this.action_loader = true;
    const new_hposition = this.hposition.nativeElement.value;
    const new_vposition = this.vposition.nativeElement.value;
    sample.position = new_vposition + new_hposition;
    if ((!isNaN(+new_hposition) && +new_hposition >= 1) && (new_vposition !== '' && new_vposition != null)) {
      if ((new_vposition === sample.vposition.toLowerCase()) && +new_hposition === +sample.hposition) {
        // tslint:disable-next-line:quotemark
        this.action_panel_msg = "The new position is the same as current sample position, sample position not changed!";
      }else {
        this.action_panel_msg = null;
        this.containerService.updateSamplePosition(this.container.pk, box_position, sample_position, new_vposition, new_hposition)
        .subscribe(() => {
          this.action_loader = false;
          // tslint:disable-next-line:quotemark
          this.alertService.success("sample is moved to the new position (" + new_vposition + new_hposition + ")!", true);
          this.forceRefresh();
        }, (err) => {
          // tslint:disable-next-line:quotemark
          this.alertService.error("Something went wrong, failed to move the sample to new position("
                                  + new_vposition + new_hposition + ')!', true);
          this.forceRefresh();
        });
      }
    }
  }

  // take or put sample back
  // need to fix the issue here
  takeSingleSampleOut(box_position: string, sample: Sample, sample_position: string) {
    this.action_panel_msg = null;
    // get today
    const today = new Date()
    const date_out = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    sample.date_out = today;
    sample.occupied = false;
    this.containerService.takeSampleOut(this.container.pk, box_position, sample_position)
    .subscribe(() => {
      this.alertService.success('sample at: ' + sample_position + ' is token out!', true);
      this.forceRefresh();
    }, (err) => {
      // tslint:disable-next-line:quotemark
      this.alertService.error("Something went wrong, failed to take out the sample at: " + sample_position + "!", true);
      this.forceRefresh();
    });
  }

  // put single sample back
  putSingleSampleBack(box_position: string, sample: Sample, sample_position: string) {
    this.action_panel_msg = null;
    const today = new Date()
    const date_out = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    sample.date_out = null;
    sample.occupied = true;
    this.containerService.putSampleBack(this.container.pk, box_position, sample_position)
    .subscribe(() => {
      // tslint:disable-next-line:quotemark
      this.alertService.success("sample at: " + sample_position + " is put back!", true);
      this.forceRefresh();
    }, (err) => {
      // tslint:disable-next-line:quotemark
      this.alertService.error("Something went wrong, failed to put back the sample at: "
      // tslint:disable-next-line:quotemark
      + sample_position + "! The slot could have been occupied, try to move the sample instead!", true);
      this.forceRefresh();
    });
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
        }, () => {
          // tslint:disable-next-line:quotemark
          this.alertService.error("failed to delete sample attachments!", true);
        });
  }

  // remove attachments of the sample after ajax call
  updateSampleAttchmentDeletion(attachment_pk_to_delete: number) {
    if (attachment_pk_to_delete != null) {
      this.sample.attachments = [...this.sample.attachments.filter(a => { return a.pk !== attachment_pk_to_delete})];
    }
  }
  // uploaded after ajax call
  updateSampleAttchmentUpload(attachment: Attachment) {
    if (attachment != null) {
      this.sample.attachments = [...this.sample.attachments, attachment];
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
        (data: Attachment) => {
          // console.log(data);
          // update sample attachment//need to return the sample object
          this.updateSampleAttchmentUpload(data);
          this.hideAttachmentUpload();
          this.alertService.success('Attchament uploaded!', true);
        },
        () => this.alertService.error('Something went wrong, the attchament not uploaded!', true)
      );
    }
  }
}
