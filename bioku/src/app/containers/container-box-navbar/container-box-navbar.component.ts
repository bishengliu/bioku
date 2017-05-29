import { Component, OnInit, Inject } from '@angular/core';
import { Container } from '../../_classes/Container';
import { Router, ActivatedRoute } from '@angular/router';
import { Box } from '../../_classes/Box';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';

@Component({
  selector: 'app-container-box-navbar',
  templateUrl: './container-box-navbar.component.html',
  styleUrls: ['./container-box-navbar.component.css']
})
export class ContainerBoxNavbarComponent implements OnInit {
  currentContaner: Container= null;
  currentBox: Box = null;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
              private router: Router) 
  {
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }
  updateState(){
    let state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.currentContainer){
      this.currentContaner = state.containerInfo.currentContainer;
      this.currentBox = state.containerInfo.currentBox;
    }
  }
  ngOnInit() {}
}
