import { Directive, EventEmitter, Input, Output, Inject, HostListener, HostBinding, Injectable } from '@angular/core';
import { ExcelUploadLoadService } from '../../_services/ExcelUploadLoadService';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { UtilityService } from '../../_services/UtilityService';
import { Sample } from '../../_classes/Sample';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType, CSubAttrData } from '../../_classes/CType';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { AlertService } from '../../_services/AlertService';
@Directive({
  selector: '[appExportSample]'
})
export class ExportSampleDirective {
  @Input() private samples; // Array<Sample> or Array<CSample>
  USE_CSAMPLE = true;
  DISPLAY_COMMON_ATTRS = true;
  constructor(private excelUploadLoadService: ExcelUploadLoadService, private xlsxHelperService: XlsxHelperService,
              private utilityService: UtilityService, @Inject(APP_CONFIG) private appSetting: any, private alertService: AlertService ) {
                this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
                this.DISPLAY_COMMON_ATTRS = this.appSetting.DISPLAY_COMMON_ATTRS;
               }
  @HostListener('click', ['$event']) public onClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.samples !== undefined && this.samples != null) {
      if (this.USE_CSAMPLE) {
        this.excelUploadLoadService
        .formatCSampleJson2AOA(this.samples)
        .subscribe((data: Array<Array<any>>) => {
          const sampleAOA: Array<Array<any>> = data;
          if (sampleAOA === null || sampleAOA.length === 0) {
            this.alertService.error('nothing to download!', true);
          } else {
            // get today
            const today = this.utilityService.getTodayFormat();
            this.xlsxHelperService.exportXlsx(sampleAOA, 'samples_' + today, 'BIOKU_EXPORTS_' + today + '.xlsx');
          }
        },
        () => {
          this.alertService.error('nothing to download!', true);
        });
      } else {
        const sampleAOA: Array<Array<any>> = this.excelUploadLoadService.formatSampleJson2AOA(this.samples);
        // get today
        const today = this.utilityService.getTodayFormat();
        this.xlsxHelperService.exportXlsx(sampleAOA, 'samples_' + today, 'BIOKU_EXPORTS_' + today + '.xlsx');
      }
    }
  }
}
