import { Injectable , Inject} from '@angular/core';
import { SampleExcelHeaders, SampleDateFormat } from '../_classes/SampleUpload'

@Injectable()
export class ExcelUploadLoadService {
 constructor() {}
    ///////////// DONOT CHANGE THIS: the order of each item must not be changed /////////////////
  getAllExcelHeaders(): Array<SampleExcelHeaders> {
    const all_headers: Array<SampleExcelHeaders>  = [];
    const box_position_headers = new SampleExcelHeaders();
    box_position_headers.headers =  ['BoxLabel', 'BoxLabel_Tower', 'BoxLabel_Shelf', 'BoxLabel_Box'];
    box_position_headers.header_type = 'box_position';
    all_headers.push(box_position_headers);

    const sample_position_headers = new SampleExcelHeaders();
    sample_position_headers.headers =  ['SampleLabel', 'SampleLabel_Row', 'SampleLabel_Column'];
    sample_position_headers.header_type = 'sample_position';
    all_headers.push(sample_position_headers);

    const general_headers = new SampleExcelHeaders();
    general_headers.headers =  ['Name', 'Tag', 'Offical Name', 'Sample Code', 'External Reference', 'Quantity',
    'Quantity Unit', 'Freezing Code', 'Freezing Date', 'Description', 'Label'];
    general_headers.header_type = 'general_headers';
    all_headers.push(general_headers);

    const cell_headers = new SampleExcelHeaders();
    cell_headers.headers =  ['Passage Number', 'Cell Cmount', 'Project', 'Creator'];
    cell_headers.header_type = 'cell_headers';
    all_headers.push(cell_headers);

    const construct_headers = new SampleExcelHeaders();
    construct_headers.headers =  ['Clone Number', '260/280', 'Feature', 'R.E. Analysis', 'Backbone', 'Insert',
    '1st maxi', 'Marker', 'Has Glycerol Stock', 'Stock Strain'];
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
}
