import { Component, OnInit, Inject, Input } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Container } from '../../_classes/Container';
@Component({
  selector: 'app-container-detail',
  templateUrl: './container-detail.component.html',
  styleUrls: ['./container-detail.component.css'],
})
export class ContainerDetailComponent implements OnInit {
  @Input() container: Container;
  appUrl: string;
  constructor(@Inject(APP_CONFIG) private appSetting: any) { 
    this.appUrl = this.appSetting.URL;
  }
  ngOnInit() {}

}
