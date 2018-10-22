import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CType, CTypeAttr, CTypeSubAttr } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import { AlertService } from '../../_services/AlertService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-ctype-detail',
  templateUrl: './ctype-detail.component.html',
  styleUrls: ['./ctype-detail.component.css']
})
export class CtypeDetailComponent implements OnInit, OnDestroy {
  ctype_minimal_attrs: Array<CTypeAttr> = new Array<CTypeAttr>();
  ctype: CType = new CType();
  // route param
  pk: number;
  private sub: any; // subscribe to params observable
  constructor(private ctypeService: CTypeService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute, ) { }
  ngOnInit() {

    this.sub = this.route.queryParams
    .switchMap(() => {
      return this.route.params
    })
    .mergeMap((params) => {
      this.pk = +params['pk'];
      return this.ctypeService.getCTypeDetail(this.pk);
    })
    .subscribe(
      (ctype: CType) => {
        // console.log(ctypes);
        this.ctype = ctype;
        this.ctype_minimal_attrs = this.ctypeService.getMinimalCTypeAttrs();
        // console.log(this.ctype_minimal_attrs);
      },
      (err) => {
        this.alertService.error('fail to load the material type, please try again later!', false);
        console.log(err)
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
