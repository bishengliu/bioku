import { Component, OnInit, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { AppSetting} from '../../../_config/AppSetting';
import {APP_CONFIG} from '../../../_providers/AppSettingProvider';
import { AppStore } from '../../../_providers/ReduxProviders';
import { User } from '../../../_classes/User';
import { Observable } from 'rxjs';
import { AlertService } from '../../../_services/AlertService';
import {UserService} from '../../../_services/UserService';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: Observable<Array<User>>;
  appUrl: String;
  tableView: Boolean = false;
  user_count: Number = 0;
  loading: Boolean = true;
  load_failed: Boolean = false;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private router: Router,
              private alertService: AlertService, private userService: UserService) {
    this.appUrl = this.appSetting.URL;
  }

  toggleList() {
    this.tableView = !this.tableView;
  }

  ngOnInit() {
    // get the user
    this.users = this.userService.getAllUsers();
    this.users.subscribe((data: any) => {
      this.user_count = data.length;
      this.loading = false;
      this.load_failed = false;
    },  () => {
      this.loading = false;
      this.load_failed = true;
    });
  }

}
