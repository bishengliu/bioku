import { Component, OnInit, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { Container } from '../../_classes/Container';
import { ContainerService } from '../../_services/ContainerService';
import {  AlertService } from '../../_services/AlertService';
@Component({
  selector: 'app-store-sample-form',
  templateUrl: './store-sample-form.component.html',
  styleUrls: ['./store-sample-form.component.css']
})
export class StoreSampleFormComponent implements OnInit {
  @Input() cells: string;
  slots: Array<string> = new Array<string>();
  @Input() container: Container;
  @Input() box: Container;
  constructor(@Inject(APP_CONFIG) private appSetting: any, private containerService: ContainerService, 
  private alertService: AlertService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {}
  ngOnChanges(){
    //positions
    this.slots = [];
    if(this.cells != null && this.cells != ""){
      this.slots = this.cells.split(',');
    }
  }
}
