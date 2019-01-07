import { Component, OnInit, Inject } from '@angular/core';
import { AppStore } from '../../_providers/ReduxProviders';
import { CType, CTypeAttr, CTypeSubAttr } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import { AlertService } from '../../_services/AlertService';
@Component({
  selector: 'app-ctype-list',
  templateUrl: './ctype-list.component.html',
  styleUrls: ['./ctype-list.component.css']
})
export class CtypeListComponent implements OnInit {
  ctype_minimal_attrs: Array<CTypeAttr> = new Array<CTypeAttr>();
  ctypes: Array<CType> = new Array<CType>();
  constructor(private ctypeService: CTypeService, private alertService: AlertService) { }
  ngOnInit() {
    this.ctypeService.getCTypes()
    .subscribe(
      (ctypes: Array<CType>) => {
        // console.log(ctypes);
        this.ctypes = ctypes;
        this.ctype_minimal_attrs = this.ctypeService.getMinimalCTypeAttrs();
        // console.log(this.ctype_minimal_attrs);
      },
      (err) => {
        this.alertService.error('fail to load material types, please try again later!', false);
        console.log(err)
      });
  }

}
