import { Injectable , Inject} from '@angular/core';
import { SampleExcelHeaders, SampleDateFormat } from '../_classes/SampleUpload'
import { Sample } from '../_classes/Sample';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType, CSubAttrData } from '../_classes/CType';
import { AppSetting } from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
import { UtilityService } from '../_services/UtilityService';
import { CTypeService } from '../_services/CTypeService';
import { Observable } from 'rxjs';

@Injectable()
export class ExcelUploadLoadService {
  attchament_error: Boolean = false;
  // CUSTOM SAMPEL CODE NAME
  custom_sample_code_name = 'sample code';
  DISPLAY_COMMON_ATTRS = true;
  private customized_attrs: Array<any> = new Array<any> ();
 constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService, private ctypeService: CTypeService, ) {
    this.custom_sample_code_name = this.appSetting.CUSTOM_SAMPLE_CODE_NAME;
    this.DISPLAY_COMMON_ATTRS = this.appSetting.DISPLAY_COMMON_ATTRS;
    this.customized_attrs = this.appSetting.CUSTOMIZED_ATTRS;
 }
  ///////////// DONOT CHANGE THIS: the order of each item must not be changed /////////////////
  getAllExcelHeaders(): Array<SampleExcelHeaders> {
    const all_headers: Array<SampleExcelHeaders>  = [];
    const box_position_headers = new SampleExcelHeaders();
    box_position_headers.headers =  ['BoxPosition', 'BoxPosition_Tower', 'BoxPosition_Shelf', 'BoxPosition_Box'];
    box_position_headers.header_type = 'box_position';
    all_headers.push(box_position_headers);

    const sample_position_headers = new SampleExcelHeaders();
    sample_position_headers.headers =  ['SamplePosition', 'SamplePosition_Row', 'SamplePosition_Column'];
    sample_position_headers.header_type = 'sample_position';
    all_headers.push(sample_position_headers);

    const general_headers = new SampleExcelHeaders();
    general_headers.headers =  ['Name', 'Tag', 'Offical Name', this.custom_sample_code_name, 'External Reference', 'Quantity',
    'Quantity Unit', 'Freezing Code', 'Freezing Date', 'Description', 'Label'];
    general_headers.header_type = 'general_headers';
    all_headers.push(general_headers);

    const cell_headers = new SampleExcelHeaders();
    cell_headers.headers =  ['Passage Number', 'Cell Amount', 'Project', 'Creator'];
    cell_headers.header_type = 'cell_headers';
    all_headers.push(cell_headers);

    const construct_headers = new SampleExcelHeaders();
    construct_headers.headers =  ['Clone Number', '260/280', 'Feature', 'R.E. Analysis', 'Backbone', 'Insert',
    '1st Maxi', 'Marker', 'Glycerol Stock', 'Stock Strain'];
    construct_headers.header_type = 'construct_headers';
    all_headers.push(construct_headers);

    const oligo_headers = new SampleExcelHeaders();
    oligo_headers.headers =  ['Oligo Name', 'Sense/Antisense', 'Oligo Sequence', 'Oligo Length', 'GC%', 'Target Sequence'];
    oligo_headers.header_type = 'oligo_headers';
    all_headers.push(oligo_headers);

    const tissue_headers = new SampleExcelHeaders();
    tissue_headers.headers =  ['Pathology Code', 'Tissue'];
    tissue_headers.header_type = 'tissue_headers';
    all_headers.push(tissue_headers);

    const virus_headers = new SampleExcelHeaders();
    virus_headers.headers =  ['Plasmid', 'Titration Titer', 'Titration Unit', 'Titration Cell Type', 'Titration Code'];
    virus_headers.header_type = 'virus_headers';
    all_headers.push(virus_headers);

    return all_headers;
  }
  ///////////// DONOT CHANGE THIS: the order of each item must not be changed/////////////////
  getAllColumnHeaders(): Array<string> {
    let all_headers: Array<string>  = [];
    const sampleExcelHeaders: Array<SampleExcelHeaders> = this.getAllExcelHeaders();
    const box_label_headers = sampleExcelHeaders.filter(h => h.header_type === 'box_position')[0].headers;
    const sample_label_headers = sampleExcelHeaders.filter(h => h.header_type === 'sample_position')[0].headers;
    const general_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'general_headers')[0].headers;
    const cell_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'cell_headers')[0].headers;
    const construct_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'construct_headers')[0].headers;
    const oligo_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'oligo_headers')[0].headers;
    const tissue_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'tissue_headers')[0].headers;
    const virus_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'virus_headers')[0].headers;
    all_headers = [
      ...box_label_headers, ...sample_label_headers, ...general_headers,
      ...cell_headers, ...construct_headers, ...oligo_headers, ...tissue_headers, ...virus_headers
    ];
    return all_headers;
  }
  ///////////// DONOT CHANGE THIS: the order of each item must not be changed/////////////////
  getAllSampleModelAttrs(): Array<string> {
    let all_headers: Array<string>  = [];
    const box_position_headers =  ['box_position', 'box_position_tower', 'box_position_shelf', 'box_position_box'];
    const sample_position_headers =  ['sample_position', 'sample_position_row', 'sample_position_column'];
    const general_headers =  ['name', 'tag', 'official_name', 'registration_code', 'reference_code', 'quantity',
    'quantity_unit', 'freezing_code', 'freezing_date', 'description', 'label'];
    const cell_headers =  ['passage_number', 'cell_amount', 'project', 'creator'];
    const construct_headers =  ['clone_number', 'against_260_280', 'feature', 'r_e_analysis', 'backbone', 'insert',
    'first_max', 'marker', 'has_glycerol_stock', 'strain'];
    const oligo_headers =  ['oligo_name', 's_or_as', 'oligo_sequence', 'oligo_length', 'oligo_GC', 'target_sequence'];
    const tissue_headers =  ['pathology_code', 'tissue'];
    const virus_headers =  ['plasmid', 'titration_titer', 'titration_unit', 'titration_cell_type', 'titration_code'];
    all_headers = [...box_position_headers, ...sample_position_headers, ...general_headers,
      ...cell_headers, ...construct_headers, ...oligo_headers, ...tissue_headers, ...virus_headers];
    return all_headers;
  }
  // //////////////////////USE CSAMPLE ////////////////////////////////////////////////////////
  // used for csample
  getSharedExcelHeaders(): Array<SampleExcelHeaders> {
      const shared_headers: Array<SampleExcelHeaders>  = [];
      // box
      const box_position_headers = new SampleExcelHeaders();
      box_position_headers.headers =  ['BoxPosition', 'BoxPosition_Tower', 'BoxPosition_Shelf', 'BoxPosition_Box'];
      box_position_headers.header_type = 'box_position';
      shared_headers.push(box_position_headers);
      // sample
      const sample_position_headers = new SampleExcelHeaders();
      sample_position_headers.headers =  ['SamplePosition', 'SamplePosition_Row', 'SamplePosition_Column'];
      sample_position_headers.header_type = 'sample_position';
      shared_headers.push(sample_position_headers);
      // minimal attr
      const minimal_attr_headers = new SampleExcelHeaders();
      minimal_attr_headers.headers = [
        this.utilityService.getCustomizedSampleAttrLabel('name', this.customized_attrs),
        this.utilityService.getCustomizedSampleAttrLabel('storage_date', this.customized_attrs),
        this.utilityService.getCustomizedSampleAttrLabel('date_out', this.customized_attrs)
      ]
      sample_position_headers.header_type = 'minimal_attrs';
      shared_headers.push(minimal_attr_headers);
      return shared_headers;
  }

  getSharedSampleModelAttrs(): Array<string> {
    let shared_attrs: Array<string>  = [];
    const box_position_headers =  ['box_position', 'box_position_tower', 'box_position_shelf', 'box_position_box'];
    const sample_position_headers =  ['sample_position', 'sample_position_row', 'sample_position_column'];
    const minimal_attrs = ['name', 'storage_date', 'date_out'];
    shared_attrs = [...box_position_headers, ...sample_position_headers, ...minimal_attrs];
    return shared_attrs;
  }
  displayFreezingDate(freezing_date_format: SampleDateFormat) {
    if (freezing_date_format !== undefined) {
      const fArray: Array<string> = [];
      fArray[freezing_date_format.day_position - 1] = '25';
      // month
      let month_example = '12';
      if (+freezing_date_format.month_format === 1) {
      // full month
        month_example = 'December';
      } else if (+freezing_date_format.month_format === 2) {
        month_example = 'Dec';
      } else {
        month_example = '12';
      }
      fArray[+freezing_date_format.month_position - 1] = month_example;
      // year
      fArray[+freezing_date_format.year_position - 1] = freezing_date_format.year_format === 0 ? '2017' : '17';
      return fArray.join(freezing_date_format.join_symbol);
    } else {
      return '';
    }
  }
  // for download
  formatCSampleJson2AOA(csamples: Array<CSample>): Observable<Array<Array<any>>> {
    let data: Array<Array<any>> = [];
    let all_ctypes: Array<CType> = new Array<CType>();
    const csample_types: Array<string> = this.getCSampleTypes(csamples);
    const USE_CSAMPLE = true;
    let sample_attrs: Array<string> = new Array<string>();
    let displayed_samples = [];
    return this.ctypeService.getCTypes()
    .mergeMap((ctypes: Array<CType>) => {
      all_ctypes = [...ctypes];
      // get table headers
      sample_attrs = this.genTableHeaders(csamples, USE_CSAMPLE, this.DISPLAY_COMMON_ATTRS, all_ctypes, csample_types);
      // process sample according to the table headers
      displayed_samples = this.genDisplaySamples(csamples, sample_attrs, USE_CSAMPLE);
      data = this.formatCSample2AOA(displayed_samples, sample_attrs);
      return Observable.of(data);
    })
    .catch(() => {
      this.DISPLAY_COMMON_ATTRS = false;
      // get table headers
      sample_attrs = this.genTableHeaders(csamples, USE_CSAMPLE, this.DISPLAY_COMMON_ATTRS, all_ctypes, csample_types);
      // process sample according to the table headers
      displayed_samples = this.genDisplaySamples(csamples, sample_attrs, USE_CSAMPLE);
      data = this.formatCSample2AOA(displayed_samples, sample_attrs);
      return Observable.of(data);
    })
  }
  genTableHeaders(csamples: Array<CSample>, USE_CSAMPLE: boolean,
    DISPLAY_COMMON_ATTRS: boolean, all_ctypes: Array<CType>, sample_types: Array<string>) {
      const exclude_date = false;
      const full_load = true;
    return this.ctypeService
    .genSamplesAttrs(csamples, USE_CSAMPLE, DISPLAY_COMMON_ATTRS, all_ctypes, sample_types, exclude_date, full_load);
  }
  // gen displayed_samples
  genDisplaySamples(csamples: Array<CSample>, sample_attrs: Array<string>, USE_CSAMPLE: boolean) {
    const displayed_samples = [];
    if (csamples != null && sample_attrs != null && USE_CSAMPLE) {
      csamples.forEach((s: CSample) => {
        const displayed_sample = this.ctypeService.genDisplaySample(s, sample_attrs);
        displayed_samples.push(displayed_sample);
      })
    }
    return displayed_samples;
  }
  formatCSample2AOA(displayed_samples: Array<any>, sample_attrs: Array<string>) {
    const data: Array<Array<any>> = [];
    // set the header as the first object
    // console.log(displayed_samples);
    // headers
    const headerAOA = new Array();
    sample_attrs.forEach((h: string, i: number) => {
      headerAOA[i + ''] = h;
    })
    data.push(headerAOA);
    // convert json to aoa
    // format the displayed_samples
    if (displayed_samples.length > 0) {
      displayed_samples.forEach((sample: any) => {
        const sampleAOA = new Array();
        sample_attrs.forEach((h: string, i: number) => {
          if (sample[h] !== undefined) {
            if (h === this.utilityService.getCustomizedSampleAttrLabel('attachments', this.customized_attrs)) {
              // deal with sample attachments
              if (sample[h] != null && sample[h].length > 0) {
                let filenames = '';
                sample[h].forEach(a => filenames += this.getAttachmentFileName(a.attachment) + ', ');
                sampleAOA[i + ''] = filenames;
              } else {
                sampleAOA[i + ''] = '';
              }
            } else if (h === this.utilityService.getCustomizedSampleAttrLabel('researchers', this.customized_attrs)) {
              // researchers
              // deal with sample user
              // only the first user
              sampleAOA[i + ''] =
              (sample[h] != null && sample[h].length > 0)
              ? sample[h][0].first_name + ' ' + sample[h][0].last_name
              : '';
            } else if (h === this.utilityService.getCustomizedSampleAttrLabel('date_out', this.customized_attrs)) {
              // sample occupation
              const occupied_key = this.utilityService.getCustomizedSampleAttrLabel('occupied', this.customized_attrs);
              if ( sample[occupied_key] !== undefined && sample[occupied_key] !== '' && sample[h] != null) {
                sampleAOA[i + ''] =  'YES/' + sample[h];
              } else {
                sampleAOA[i + ''] = '';
              }
            } else {
              // all other keys
              sampleAOA[i + ''] = sample[h] !== null ? sample[h] : '';
            }
          } else {
            sampleAOA[i + ''] = '';
          }
        })
        data.push(sampleAOA);
      })
    }
    return data;
  }
  // save sample json to aoa
  formatSampleJson2AOA(samples: Array<Sample>, selected_headers: Array<string> = new Array<string>()): Array<Array<any>> {
      const data: Array<Array<any>> = [];
      // validate sample types and get excel headers
      let headers = new Array<string>();
      if (selected_headers === undefined || selected_headers === null || selected_headers.length === 0) {
        // prepare the headers
        // get the sample types
        const sample_types = this.getSampleTypes(samples);
        // get front headers
        headers = [...this.getMinimalSampleFrontHeaders()];
        // cells
        if (sample_types.indexOf('CELL') !== -1) {
          const cell_headers =  ['passage_number', 'cell_amount', 'project', 'creator'];
          headers = [...headers, ...cell_headers];
        }
        // CONSTRUCT
        if (sample_types.indexOf('CONSTRUCT') !== -1) {
          const construct_headers =  ['clone_number', 'against_260_280', 'feature', 'r_e_analysis', 'backbone', 'insert',
          'first_max', 'marker', 'has_glycerol_stock', 'strain'];
          headers = [...headers, ...construct_headers];
        }
        // 'OLIGO' or 'gRNA_OLIGO',
        if (sample_types.indexOf('OLIGO') !== -1 || sample_types.indexOf('gRNA_OLIGO') !== -1 ) {
          const oligo_headers =  ['oligo_name', 's_or_as', 'oligo_sequence', 'oligo_length', 'oligo_GC', 'target_sequence'];
          headers = [...headers, ...oligo_headers];
        }
        // tissue
        if (sample_types.indexOf('TISSUE') !== -1) {
          const tissue_headers =  ['pathology_code', 'tissue'];
          headers = [...headers, ...tissue_headers];
        }
        // virus
        if (sample_types.indexOf('TISSUE') !== -1) {
          const virus_headers =  ['plasmid', 'titration_titer', 'titration_unit', 'titration_cell_type', 'titration_code'];
          headers = [...headers, ...virus_headers];
        }
        // get end headers
        headers = [...headers, ...this.getMinimalSampleEndHeaders()];
      } else {
        headers = [...selected_headers];
      }
      // set the header as the first object
      const headerAOA = new Array();
      headers.forEach((h: string, i: number) => {
        headerAOA[i + ''] = this.renderSampleHeader(h);
      })
      data.push(headerAOA);
      // convert json to aoa
      // format the sample
      if (samples.length > 0) {
        samples.forEach((sample: Sample) => {
          const sampleAOA = new Array();
          headers.forEach((h: string, i: number) => {
            if (sample[h] !== undefined) {
              if (h === 'attachments') {
                // deal with sample attachments
                if (sample[h] != null && sample[h].length > 0) {
                  let filenames = '';
                  sample[h].forEach(a => filenames += this.getAttachmentFileName(a.attachment) + ', ');
                  sampleAOA[i + ''] = filenames;
                } else {
                  sampleAOA[i + ''] = '';
                }
              } else if (h === 'researchers') {
                // deal with sample user
              // only the first user
              sampleAOA[i + ''] = (sample[h] != null && sample[h].length > 0) ? sample[h][0].first_name + ' ' + sample[h][0].last_name : '';
              } else if (h === 'date_out') {
                // sample occupation
                if ( sample['occupied'] !== undefined && !sample['occupied'] && sample[h] != null) {
                  sampleAOA[i + ''] =  'YES/' + sample[h];
                } else {
                  sampleAOA[i + ''] = '';
                }
              } else if (h === 's_or_as') {
                sampleAOA[i + ''] = sample[h] != null  ? (sample[h] === true ? 'sense' : 'antisense') : '';
              } else {
                // all other keys
                sampleAOA[i + ''] = sample[h] !== null ? sample[h] : '';
              }
            } else {
              sampleAOA[i + ''] = '';
            }
          })
          data.push(sampleAOA);
        })
      }
      // console.log(data);
      return data;
  }
  // get the ctypes of csamples
  getCSampleTypes(csamples: Array<CSample>) {
    return Object.assign([], this.ctypeService.getSampleTypes(true, csamples));
  }
  // get sample types from samples
  getSampleTypes(samples: Array<Sample>): Array<string> {
    const sample_types = new Array<string>();
    const all_sample_types = ['GENERAL', 'CELL', 'CONSTRUCT', 'OLIGO', 'gRNA_OLIGO', 'TISSUE', 'VIRUS']; // DO NOT CHANGE THIS *****
    all_sample_types.forEach((type: string) => {
      const sample_found: Sample = samples.find((sample: Sample) => sample.type === type);
      if (sample_found !== undefined && sample_types.indexOf(type) === -1) {
        sample_types.push(type);
      }
    });
    return sample_types;
  }
  // get the minial sample front headers for exporting to excel
  getMinimalSampleFrontHeaders(): Array<string> {
    let front_headers = Array<string>();
    front_headers = [
      'container', 'box_position', 'position', 'name', 'official_name', 'type', 'label', 'tag',
      'freezing_date', 'freezing_code', 'registration_code', 'reference_code', 'quantity', 'quantity_unit'
    ];
    return front_headers;
  }
  // get the minial sample end headers for exporting to excel
  getMinimalSampleEndHeaders(): Array<string> {
    let end_headers = Array<string>();
    end_headers = ['date_out', 'attachments', 'description', 'researchers'];
    return end_headers;
  }
  // render sample header
  renderSampleHeader(header: string): string {
    const sampleAllColumnHeaders: Array<string> = ['Freezer', ...this.getAllColumnHeaders(),
                                                    'Box', 'Position', 'Taken Out', 'Attachments', 'Researcher', 'Sample Type'];
    const sampleAllSampleModelAttr: Array<string> = ['container', ...this.getAllSampleModelAttrs(),
                                                    'box_position', 'position', 'date_out', 'attachments', 'researchers', 'type'];
    const header_index = sampleAllSampleModelAttr.indexOf(header);
    if (header_index !== -1) {
      return sampleAllColumnHeaders[header_index];
    }
    return header;
  }

  // get attachment file name
  getAttachmentFileName(filePath: string) {
    if (filePath.indexOf('/') !== -1) {
      const fArray = filePath.split('/');
      return fArray[fArray.length - 1];
    } else {
      return filePath;
    }
  }
}
