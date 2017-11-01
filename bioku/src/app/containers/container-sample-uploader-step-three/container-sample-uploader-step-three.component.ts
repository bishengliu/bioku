import { Component, OnInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
import { BoxLabel, SampleLabel, SampleAttr, SampleFile } from '../../_classes/sampleUpload';

@Component({
  selector: 'app-container-sample-uploader-step-three',
  templateUrl: './container-sample-uploader-step-three.component.html',
  styleUrls: ['./container-sample-uploader-step-three.component.css']
})
export class ContainerSampleUploaderStepThreeComponent implements OnInit {
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
  max_column_count = 10;
  column_count = 10;
  excel_file_has_header: Boolean = true;

  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService,
              private xlsxHelperService: XlsxHelperService, ) { }

  ngOnInit() {
    this.sampleFile = new SampleFile();
    this.setDefaultSampleFile();
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
    //////////// need to get column count and data attrs ////////////
    this.column_headers = this.updateSampleAttr(this.sample_type, this.bLabel, this.sLabel);

  }
  toggleExcelFilerHeader() {
    this.excel_file_has_header = !this.excel_file_has_header;
  }
  updateColumnCount (evt: any) {
    this.column_count = evt;
  }
  setDefaultSampleFile() {
    this.sample_type = 'GENERAL';
    this.excel_file_has_header = true;
    // set up column count and headers
    this.column_headers = this.updateSampleAttr(this.sample_type, this.bLabel, this.sLabel);
    this.max_column_count = this.column_headers.length;
    this.column_count = this.column_headers.length;
  }
  updateSampleAttr (sample_type: string, bLabel: BoxLabel, sLabel: SampleLabel): Array<string> {
    let sample_headers: Array<string> = [];
    // box label
    if (bLabel.box_defined_as_normal && bLabel.box_tsb_one_column) {
      sample_headers.push('BoxLabel');
      // 1 col for box label
    } else if (bLabel.box_defined_as_normal && !bLabel.box_tsb_one_column) {
      sample_headers.push('BoxLabel_Tower');
      sample_headers.push('BoxLabel_Shelf');
      sample_headers.push('BoxLabel_Box');
      // 3 col for box label
    } else if (!bLabel.box_defined_as_normal && bLabel.box_sample_separated) {
      // 1 col for box label
      sample_headers.push('BoxLabel');
    } else {
      // no box lable col
    }
    // sample label
    if (sLabel.sampleLabelDefinition === 2) {
      // 2 cols for sample label
      sample_headers.push('SampleLabel_Column');
      sample_headers.push('SampleLabel_Row');
    } else {
      // 1 col for sample label
      sample_headers.push('SampleLabel');
    }
    const general_headers: Array<string> = ['Name', 'Tag', 'Offical Name', 'Sample Code', 'External Reference', 'quantity',
                                            'quantity Unit', 'Freezing Code', 'Freezing Date', 'Description'];
    const cell_headers: Array<string> = ['Passage Number', 'Cell Cmount', 'Project', 'Creator'];
    const construct_headers: Array<string> = ['Clone Number', '260/280', 'Feature', 'R.E. Analysis', 'Backbone', 'Insert',
                                              'ist maxi', 'Marker', 'Has Glycerol Stock', 'Stock Strain'];
    const oligo_headers: Array<string> = ['Oligo Name', 'Sense/Antisense', 'Oligo Sequence', 'Oligo Length', 'GC%', 'Target Sequence'];
    const tissue_headers: Array<string> = ['Pathology Code', 'Tissue'];
    const virus_headers: Array<string> = ['Plasmid', 'Titration Titer', 'Titration Unit', 'Titration Cell Type', 'Titration Code'];
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
  /////////////////need to map header to sample table attrs/////////////////////
}
