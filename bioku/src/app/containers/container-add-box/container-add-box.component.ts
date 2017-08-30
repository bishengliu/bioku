import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { Box } from '../../_classes/Box';
import {  ContainerService } from '../../_services/ContainerService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { SetCurrentContainerAction, setCurrentContainerActionCreator } from '../../_redux/container/container_actions';

@Component({
  selector: 'app-container-add-box',
  templateUrl: './container-add-box.component.html',
  styleUrls: ['./container-add-box.component.css']
})
export class ContainerAddBoxComponent implements OnInit, OnDestroy {
  //auth user
  user: User = null;
  token: string = null;

  //route param
  id: number;
  private sub: any; //subscribe to params observable

  //CURRENT CONTAINER
  container: Container = null;
  //current boxes
  boxes: Array<Box> = [];
  //occupied box positions
  occupied_postions: Array<string> = [];
  //available positions
  available_positions: Array<string> = [];

  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private router: Router, private http: Http,
              private containerService: ContainerService,)
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
    //get current occupied boxes
    if (state.containerInfo && state.containerInfo.currentBox){
      this.boxes = state.containerInfo.currentBox;
    }
  }
  ngOnInit() {
    this.sub = this.route.params
    .mergeMap((params) =>{
      this.id = +params['id'];
      if( this.container != null && this.container.pk === this.id){
        return Observable.of(this.container);      
      }
      else{
        return this.containerService.containerDetail(this.id);
      }
    });

    this.sub.mergeMap((container: any)=>{
      return Observable.of(container);    
    }).map((response: Response) =>response.json()).do(data=>console.log(data));
    //displatch current container
    this.sub.subscribe((container: any)=>{
      this.container = container;
      //dispatch appstore to update container
      //let setCurrentContainerAction : SetCurrentContainerAction = setCurrentContainerActionCreator(this.container);
      //this.appStore.dispatch(setCurrentContainerAction);
    },
    ()=>{});


  }
  ngOnDestroy() { this.sub.unsubscribe(); }
}
