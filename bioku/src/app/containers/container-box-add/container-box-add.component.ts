import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { User } from '../../_classes/User';
import { Box } from '../../_classes/Box';
import { Container } from '../../_classes/Container';
import { ContainerTower, Containershelf, BoxAvailability } from '../../_classes/ContainerTower';
import {  ContainerService } from '../../_services/ContainerService';
import { LocalStorageService } from '../../_services/LocalStorageService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';

@Component({
  selector: 'app-container-box-add',
  templateUrl: './container-box-add.component.html',
  styleUrls: ['./container-box-add.component.css']
})
export class ContainerBoxAddComponent implements OnInit, OnDestroy {
  //auth user
  user: User = null;
  token: string = null;

  //route param
  id: number;
  private sub: any; //subscribe to params observable
  //CURRENT CONTAINER
  container: Container;
  boxes: Array<BoxAvailability> = new Array<BoxAvailability>();
  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
  private router: Router, private http: Http, private containerService: ContainerService, private localStorageService: LocalStorageService)
  { 
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }
  updateState(){
    let state= this.appStore.getState()

    //set auth user
    if(state.authInfo){
    this.user = state.authInfo.authUser;
    this.token = state.authInfo.token.token;
    }
    //get current container
    if (state.containerInfo && state.containerInfo.currentContainer){
    this.container = state.containerInfo.currentContainer;
    }
  }

  ngOnInit() {
    this.sub = this.route.params
    .mergeMap((params) =>{
      this.id = +params['id'];
      if( this.container != null && this.container.pk === this.id){
        return Observable.of(this.container);}
      else{
        return this.containerService.containerDetail(this.id);}
    });

    //container and boxes observable
    this.sub.subscribe((container: Container)=>{this.container = container}, (err)=>{console.log(err)});
    this.boxes = this.localStorageService.boxAvailabilities;
    console.log(this.container);
    console.log(this.boxes);
  }
  ngOnDestroy() { this.sub.unsubscribe(); }
}
