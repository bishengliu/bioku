import { FileDropDirective } from './file-drop.directive';
import {  AlertService } from '../../_services/AlertService';
import { Router } from '@angular/router';

describe('FileDropDirective', () => {
  it('should create an instance', () => {
    const directive = new FileDropDirective();
    expect(directive).toBeTruthy();
  });
});
