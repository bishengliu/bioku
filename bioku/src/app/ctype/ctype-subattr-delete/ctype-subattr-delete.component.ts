import { Component, OnInit, OnDestroy } from '@angular/core';
import { CType, CTypeAttr, CTypeSubAttr, CTypeSubAttrExt } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import { AlertService } from '../../_services/AlertService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-ctype-subattr-delete',
  templateUrl: './ctype-subattr-delete.component.html',
  styleUrls: ['./ctype-subattr-delete.component.css']
})
export class CtypeSubattrDeleteComponent implements OnInit {
  ctype_pk: number;
  attr_pk: number;
  subattr_pk: number;
  private sub: any; // subscribe to params observable
  cSubAttr: CTypeSubAttr = new CTypeSubAttr();
  allow_change = false;
  constructor(private ctypeService: CTypeService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute, ) {
    this.sub = this.route.parent.parent.params
    .switchMap(params => {
      this.ctype_pk = +params['pk'];
      return this.route.parent.params;
    })
    .switchMap(params => {
      this.attr_pk = +params['attr_pk'];
      return this.route.params;
    })
    .mergeMap((params) => {
      this.subattr_pk = +params['subattr_pk'];
      return this.ctypeService.getCTypeSubAttrDetail(this.ctype_pk, this.attr_pk, this.subattr_pk)
    })
    .subscribe(
      (cSubAttr: CTypeSubAttrExt) => { 
        this.cSubAttr = cSubAttr;
        this.allow_change = +cSubAttr.data_count  === 0 ? true : false;
       },
      () => {
        this.alertService.error('SOMETHING WENT WRONG, FAILED TO LOAD THE SUBATTR!', true);
        this.router.navigate(['../ctypes', this.ctype_pk, this.attr_pk]);
      });
    }

  ngOnInit() {
  }
  delete() {
    this.ctypeService.deleteCTypeSubAttr(this.ctype_pk, this.attr_pk, this.subattr_pk)
    .subscribe(() => {
      this.alertService.success('THE SUBATTR DELETED!', true);
      this.router.navigate(['../ctypes', this.ctype_pk], { queryParams: { 'refresh': 'DEL_ATTR' } });
    },
    () => {
      this.alertService.error('SOMETHING WENT WRONG, FAILED TO DELETE THE SUBATTR!', true);
      this.router.navigate(['../ctypes', this.ctype_pk, this.attr_pk]);
    });
  }
}
