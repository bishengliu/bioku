import { Component, OnInit, Inject } from '@angular/core';
import { CType, CTypeAttr, CTypeSubAttr } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import { AlertService } from '../../_services/AlertService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-ctype-attr-detail',
  templateUrl: './ctype-attr-detail.component.html',
  styleUrls: ['./ctype-attr-detail.component.css']
})
export class CtypeAttrDetailComponent implements OnInit {
  pk: number;
  attr_pk: number;
  ctype_attr: CTypeAttr = new CTypeAttr();
  private sub: any; // subscribe to params observable
  constructor(private ctypeService: CTypeService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute, ) { }

  // parse attr value type
  parseAttrValueType(ctype_attr): string {
    let value_type = 'short text';
    if (ctype_attr.attr_value_type !== null
      && !isNaN(+(ctype_attr.attr_value_type))) {
        if (+(ctype_attr.attr_value_type === 0)) {
        ctype_attr.attr_value_text_max_length === null || ctype_attr.attr_value_text_max_length <= 50
        ? value_type = 'short text'
        : value_type = 'long text';
      } else if (+(ctype_attr.attr_value_type === 1)) {
        value_type = 'integer number';
      } else if (+(ctype_attr.attr_value_type === 2)) {
        value_type = 'decimal number';
      } else if (+(ctype_attr.attr_value_type === 4)) {
        value_type = 'date';
      } else {
        value_type = 'n/a';
      }
    }
    return value_type;
  }
  ngOnInit() {
    this.route.parent.params
    .switchMap(params => {
      this.pk = +params['pk'];
      return this.route.params;
    })
    .mergeMap((params) => {
      this.attr_pk = +params['attr_pk'];
      if (this.attr_pk < 0 ) {
        return Observable.of(this.ctypeService.getMinimalCtypeAttr(this.attr_pk))
      }
      return this.ctypeService.getCTypeAttrDetail(this.pk, this.attr_pk);
    })
    .subscribe(
      (ctype_attr: CTypeAttr) => {
        // console.log(ctypes);
        this.ctype_attr = ctype_attr;
        if (this.ctype_attr !== null && this.ctype_attr.ctype_id === null ) {
          this.ctype_attr.ctype_id = this.pk;
        }
        console.log(this.ctype_attr);
      },
      (err) => {
        this.alertService.error('fail to load the attribute of the material type, please try again later!', false);
        console.log(err)
      });
  }

}
