import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';

//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';

@Component({
  selector: 'app-container-add-box',
  templateUrl: './container-add-box.component.html',
  styleUrls: ['./container-add-box.component.css']
})
export class ContainerAddBoxComponent implements OnInit {

  //route param
  id: number;
  private sub: any; //subscribe to params observable

  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private router: Router)
   { 
     console.log('hit...');
   }

  ngOnInit() {
    this.sub = this.route.params
    .subscribe((params)=>{
      this.id = +params['id'];
      console.log(this.id);
    })
  }
  ngOnDestroy() { this.sub.unsubscribe(); }
}
