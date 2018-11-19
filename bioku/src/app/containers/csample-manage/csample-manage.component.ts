import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType, CSubAttrData } from '../../_classes/CType';
import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { AppStore } from '../../_providers/ReduxProviders';
import { CTypeService } from '../../_services/CTypeService';
import { UtilityService } from '../../_services/UtilityService';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-csample-manage',
  templateUrl: './csample-manage.component.html',
  styleUrls: ['./csample-manage.component.css']
})
export class CsampleManageComponent implements OnInit {
  loading = true;
  load_failed = false;
  // route param
  ct_pk: number;
  box_pos: string;
  sp_pos: string
  sp_pk: number
  private sub: any; // subscribe to params observable
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private route: ActivatedRoute,
  private ctypeService: CTypeService, private utilityService: UtilityService) { }

  ngOnInit() {
    this.sub = this.route.params
    .mergeMap((params) => {
      this.load_failed = false;
        this.loading = true;
        this.ct_pk = +params['ct_pk'];
        this.box_pos = params['box_pos'];
        this.sp_pos = params['sp_pos']
        this.sp_pk = +params['sp_pk'];
        console.log([this.ct_pk, this.box_pos, this.sp_pos, this.sp_pk]);
        // get sample detail
      return Observable.of(null);
    })
    .subscribe();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
