import { Component, OnInit, OnDestroy } from '@angular/core';
import { CType, CTypeAttr, CTypeSubAttr, CTypeAttrExt } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import { AlertService } from '../../_services/AlertService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-ctype-attr-delete',
  templateUrl: './ctype-attr-delete.component.html',
  styleUrls: ['./ctype-attr-delete.component.css']
})
export class CtypeAttrDeleteComponent implements OnInit, OnDestroy {
  ctype_pk: number;
  attr_pk: number;
  cAttr: CTypeAttr = new CTypeAttr();
  private sub: any; // subscribe to params observable
  allow_change = false;
  constructor(private ctypeService: CTypeService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute, ) { }
  ngOnInit() {
    this.sub = this.route.parent.params
    .switchMap(params => {
      this.ctype_pk = +params['pk'];
      return this.route.params;
    })
    .mergeMap((params) => {
      this.attr_pk = +params['attr_pk'];
      return this.ctypeService.getCTypeAttrDetail(this.ctype_pk, this.attr_pk)
    })
    .subscribe((cAttr: CTypeAttrExt) => { 
      this.cAttr = cAttr;
      this.allow_change = +cAttr.data_count  === 0 ? true : false;
     })
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  delete() {
    this.ctypeService.deleteCTypeAttr(this.ctype_pk, this.attr_pk)
    .subscribe(() => {
      this.alertService.success('THE ATTR DELETED!', true);
      this.router.navigate(['../ctypes', this.ctype_pk], { queryParams: { 'refresh': 'DEL_ATTR' } });
    },
    () => {
      this.alertService.error('SOMETHING WENT WRONG, FAILED TO DELETE THE ATTR!', true);
      this.router.navigate(['../ctypes', this.ctype_pk]);
    });
  }
}
