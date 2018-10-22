import { Component, OnInit, OnDestroy } from '@angular/core';
import { CType, CTypeAttr, CTypeSubAttr } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import { AlertService } from '../../_services/AlertService';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-ctype-delete',
  templateUrl: './ctype-delete.component.html',
  styleUrls: ['./ctype-delete.component.css']
})
export class CtypeDeleteComponent implements OnInit, OnDestroy {
  pk: number;
  private sub: any; // subscribe to params observable
  constructor(private ctypeService: CTypeService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute, ) { }
  delete() {
    this.ctypeService.deleteCType(this.pk)
    .subscribe(() => {
      this.alertService.success('THE TYPE DELETED!', true);
      this.router.navigate(['../ctypes']);
    },
    () => {
      this.alertService.error('SOMETHING WENT WRONG, FAILED TO DELETE THE TYPE!', true);
      this.router.navigate(['../ctypes']);
    });
  }
  ngOnInit() {
    this.sub = this.route.parent.params
    .subscribe((params) => {
      this.pk = +params['pk'];
    })
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
