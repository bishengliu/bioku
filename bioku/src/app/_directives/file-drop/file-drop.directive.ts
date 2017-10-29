import { Directive, EventEmitter, Input, Output, HostListener, HostBinding } from '@angular/core';
import {  AlertService } from '../../_services/AlertService';
@Directive({
  selector: '[appFileDrop]'
})
export class FileDropDirective {
  @Output() private validFiles: EventEmitter<Array<File>> = new EventEmitter();
  // @Output() private invalidFiles: EventEmitter<Array<File>> = new EventEmitter();
  @Input()  private allowedExtensions: Array<string> =  ['xlsx']; // default excel file extension
  @Input()  private allowedMultipleFiles: Boolean =  true ;
  @HostBinding('style.background') private background = '#eee';
  constructor(private alertService: AlertService) { }

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee'
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.alertService.clearMessage();
    const files: FileList = evt.dataTransfer.files;
    if (!this.allowedMultipleFiles && files && files.length > 1) {
      this.alertService.error('Only one file is allowed!', true);
      this.validFiles.emit([]);
      // this.invalidFiles.emit([]);
    } else {
      // check file extensions
      const valid_files: Array<File> = [];
      const invalid_files: Array<string> = [];
      // const invalid_files: Array<File> = [];
      if (files.length > 0) {
        for ( let i = 0; i < files.length; i++) {
          if (files[i].name.indexOf('.') === -1) {
            invalid_files.push(files[i].name);
          } else {
            const file_extension = files[i].name.split('.')[files[i].name.split('.').length - 1];
            if (this.allowedExtensions.lastIndexOf(file_extension) !== -1) {
              valid_files.push(files[i]);
            } else {
              invalid_files.push(files[i].name);
            }
          }
        }
        if (invalid_files.length > 0) {
          this.alertService.error( 'Following files are invalid: ' + invalid_files.join(', '), true);
        }
        this.validFiles.emit(valid_files);
      }
    }
  }
}
