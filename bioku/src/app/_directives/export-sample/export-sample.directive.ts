import { Directive, EventEmitter, Input, Output, Inject, HostListener, HostBinding, Injectable } from '@angular/core';
import { ExcelUploadLoadService } from '../../_services/ExcelUploadLoadService';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { UtilityService } from '../../_services/UtilityService';
import { Sample } from '../../_classes/Sample';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType, CSubAttrData } from '../../_classes/CType';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
@Directive({
  selector: '[appExportSample]'
})
export class ExportSampleDirective {
  @Input()  private samples: Array<Sample>;
  USE_CSAMPLE = true;
  constructor(private excelUploadLoadService: ExcelUploadLoadService, private xlsxHelperService: XlsxHelperService,
              private utilityService: UtilityService, @Inject(APP_CONFIG) private appSetting: any) {
                this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
               }
  @HostListener('click', ['$event']) public onClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.samples !== undefined && this.samples != null) {
      const sampleAOA: Array<Array<any>> = this.excelUploadLoadService.formatSampleJson2AOA(this.samples);
      // get today
      const today = this.utilityService.getTodayFormat();
      this.xlsxHelperService.exportXlsx(sampleAOA, 'Samples_' + today, 'BIOKU_SAMPLE_EXPORT.xlsx');
    }
  }
}
