import { Component, OnInit, Inject, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
import { BoxLabel, SampleLabel, ColumnAttr, SampleFile, SampleExcelHeaders } from '../../_classes/sampleUpload';
// dragula
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'app-container-sample-uploader-step-three',
  templateUrl: './container-sample-uploader-step-three.component.html',
  styleUrls: ['./container-sample-uploader-step-three.component.css']
})
export class ContainerSampleUploaderStepThreeComponent implements OnInit, OnDestroy {
  @Output() activeStep: EventEmitter<number> = new EventEmitter<number> ();
  @Input() sLabel: SampleLabel;
  @Input() bLabel: BoxLabel;
  uploaded: Boolean = false;
  data: Array<Array<any>> = [];
  workbook_opts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
  fileName = 'SheetJS.xlsx';
  worksheet_name = 'sheet';
  allowedFileExtension: Array<string> = ['xlsx'];
  allowedMultipleFiles: Boolean = false;
  rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
  data_to_display = 100;
  parsing_file: Boolean = false;

  sampleFile: SampleFile = new SampleFile();
  column_headers: Array<string> = [];
  sample_type = 'GENERAL';
  excel_file_has_header: Boolean = true;

  // excel upload map to sample model
  excelColAttrs: Array<ColumnAttr> = [];

   // dragular driective options
   private dragulaDrop$: any;
   dragulaOptions: any = {
      direction: 'vertical',
      revertOnSpill: true,
      // accepts: (el, container, handle) => { return container.id !== 'no-drop'; }, // prevent from drop back
      // copy: (el, container, handle) => { return container.id === 'no-drop'; }, // copy for this container only
      // removeOnSpill: (el, container, handle) => { return container.id !== 'no-drop'; }, // for not this container
   }

  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService,
              private xlsxHelperService: XlsxHelperService, private dragulaService: DragulaService) { }

  ngOnInit() {
    this.sampleFile = new SampleFile();
    this.setDefaultSampleFile();

    // dragular
    this.dragulaDrop$ = this.dragulaService.drop.subscribe((value) => {
      const header_div_moved = value[1]; // el moved
      const source = value[3];
      const target = value[2];
      // prevent from put 2 heders in td
      if (target.id !== 'column_headers' &&  target.children.length > 1 ) {
        this.dragulaService.find('bag').drake.cancel(true);
      } else {
        const source_column = source.attributes['column'].value;
        const target_column = target.attributes['column'].value
        const header_moved = header_div_moved.attributes['header'].value
        this.onDragulaDrop(+source_column, +target_column, header_moved);
      }
    });
  }
  private onDragulaDrop(source_column: number, target_column: number, header_moved: string) {
    // console.log([source_column, target_column, header_moved]);
    this.updateColumnAttrs(source_column, target_column, header_moved);
  }


  handleValidFileDrop(evt: Array<File>) {
    this.parsing_file = true;
    this.xlsxHelperService.parseDrop(evt, this.rABS, this.fileName)
    .subscribe(
      (data: Array<Array<any>>) => {
        this.data = this.trimData(data);
        this.uploaded = true;
        this.data_to_display = this.data.length > 100 ? 100 : this.data.length;
        this.parsing_file = false;
        console.log(this.data);
      },
      (err: string) => {
        console.log(err);
        this.uploaded = false;
        this.parsing_file = false;
      });
  }
  // only trim the top not the left side
  trimData (data: Array<Array<any>>): Array<Array<any>> {
    return data.filter((d: Array<any>) => {
      return d.length > 0;
    })
  }
  backSecondStep() {
    this.activeStep.emit(2);
    this.data = [];
    this.uploaded = false;
    this.data_to_display = 100;
    this.setDefaultSampleFile()
  }
  updateSampleType(sample_type: string): void {
    this.sample_type = sample_type === '' ? this.sample_type : sample_type;
    this.column_headers = this.updateColumnHeaders(this.sample_type, this.bLabel, this.sLabel);
    this.setDefaultColumnAttrs();
  }
  toggleExcelFilerHeader() {
    this.excel_file_has_header = !this.excel_file_has_header;
  }

  setDefaultSampleFile() {
    this.sample_type = 'GENERAL';
    this.excel_file_has_header = true;
    // set up column count and headers
    this.column_headers = this.updateColumnHeaders(this.sample_type, this.bLabel, this.sLabel);
    this.setDefaultColumnAttrs();
  }
  updateColumnHeaders (sample_type: string, bLabel: BoxLabel, sLabel: SampleLabel): Array<string> {
    const all_headers: Array<SampleExcelHeaders> = this.getAllExcelHeaders();
    let sample_headers: Array<string> = [];
    // box label
    const box_label_headers = all_headers.filter(h => h.header_type === 'box_position')[0].headers;
    if (bLabel.box_defined_as_normal && bLabel.box_tsb_one_column) {
      sample_headers.push(box_label_headers[0]);
      // 1 col for box label
    } else if (bLabel.box_defined_as_normal && !bLabel.box_tsb_one_column) {
      sample_headers.push(box_label_headers[1]);
      sample_headers.push(box_label_headers[2]);
      sample_headers.push(box_label_headers[3]);
      // 3 col for box label
    } else if (!bLabel.box_defined_as_normal && bLabel.box_sample_separated) {
      // 1 col for box label
      sample_headers.push(box_label_headers[0]);
    } else {
      // no box lable col
    }
    // sample label
    const sample_label_headers = all_headers.filter(h => h.header_type === 'sample_position')[0].headers;
    if (sLabel.sampleLabelDefinition === 2) {
      // 2 cols for sample label
      sample_headers.push(sample_label_headers[1]);
      sample_headers.push(sample_label_headers[2]);

    } else {
      // 1 col for sample label
      sample_headers.push(sample_label_headers[0]);
    }
    const general_headers: Array<string> = all_headers.filter(h => h.header_type === 'general_headers')[0].headers;
    const cell_headers: Array<string> = all_headers.filter(h => h.header_type === 'cell_headers')[0].headers;
    const construct_headers: Array<string> = all_headers.filter(h => h.header_type === 'construct_headers')[0].headers;
    const oligo_headers: Array<string> = all_headers.filter(h => h.header_type === 'oligo_headers')[0].headers;
    const tissue_headers: Array<string> = all_headers.filter(h => h.header_type === 'tissue_headers')[0].headers;
    const virus_headers: Array<string> = all_headers.filter(h => h.header_type === 'virus_headers')[0].headers;
    switch (sample_type) {
      case 'GENERAL':
        sample_headers = [...general_headers];
        break;
      case 'CELL':
        sample_headers = [...general_headers, ...cell_headers];
        break;
      case 'CONSTRUCT':
        sample_headers = [...general_headers, ...construct_headers];
        break;
      case 'OLIGO':
        sample_headers = [...general_headers, ...oligo_headers];
        break;
      case 'gRNA_OLIGO':
        sample_headers = [...general_headers, ...oligo_headers];
        break;
      case 'TISSUE':
        sample_headers = [...general_headers, ...tissue_headers];
        break;
      case 'VIRUS':
        sample_headers = [...general_headers, ...virus_headers];
        break;
      default:
        sample_headers = [...general_headers];
        break;
    }
    return sample_headers;
  }

  setDefaultColumnAttrs (): void {
    this.excelColAttrs = [];
    const allColumnHeaders = this.getAllColumnHeaders();
    this.column_headers.forEach((h: string) => {
      const colAttr = new ColumnAttr();
            // get the index of current header
      const col_index = allColumnHeaders.indexOf(h);
      if (col_index !== -1) {
        const columnAttr = new ColumnAttr();
        columnAttr.col_header = h;
        columnAttr.col_number = -1;
        columnAttr.sample_attr_index = col_index; // use this to map to sample table attr
        this.excelColAttrs.push(columnAttr);
      }
    })
  }

  updateColumnAttrs (source_column: number, target_column: number, header_moved: string): void {
    // move
    this.excelColAttrs.forEach(a => {
      if (a.col_header === header_moved) {
        a.col_number = target_column;
      }
    });
  }

  ///////////// DONOT CHANGE THIS /////////////////
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
    'Quantity Unit', 'Freezing Code', 'Freezing Date', 'Description'];
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
  ///////////// DONOT CHANGE THIS /////////////////
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
  ///////////// DONOT CHANGE THIS /////////////////
  getAllColumnAttrs(): Array<string> {
    let all_headers: Array<string>  = [];
    const box_position_headers =  ['box_position', 'box_position_tower', 'box_position_shelf', 'box_position_box'];
    const sample_position_headers =  ['sample_position', 'sample_position_row', 'sample_position_column'];
    const general_headers =  ['name', 'tag', 'official_name', 'registration_code', 'reference_code', 'quantity',
    'quantity_unit', 'freezing_code', 'freezing_date', 'description'];
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
  ngOnDestroy() {
    if (this.dragulaDrop$ !== undefined) {
      this.dragulaDrop$.unsubscribe();
    }
  }
}
