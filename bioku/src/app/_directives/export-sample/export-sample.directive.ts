import { Directive, EventEmitter, Input, Output, HostListener, HostBinding, Injectable } from '@angular/core';
import {  ExcelUploadLoadService } from '../../_services/ExcelUploadLoadService';
import {  XlsxHelperService } from '../../_services/XlsxHelperService';
import { Sample } from '../../_classes/Sample';
@Directive({
  selector: '[appExportSample]'
})
export class ExportSampleDirective {
  @Input()  private samples: Array<Sample>;
  constructor(private excelUploadLoadService: ExcelUploadLoadService) { }
  @HostListener('click', ['$event']) public onClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.samples !== undefined && this.samples != null) {
      const sampleAOA: Array<Array<any>> = this.excelUploadLoadService.formatSampleJson2AOA(this.samples);
      console.log('aoa', sampleAOA);
    }
  }
}
