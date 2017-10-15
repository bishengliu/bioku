import { Component, OnInit } from '@angular/core';
import {AlertService} from '../../_services/AlertService';
import {Alert} from '../../_classes/Alert';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  message: Alert;
  alertClass: Array<string> = [];
  constructor(private alertService: AlertService) {}

  ngOnInit() {
    // get the message from observable
    this.alertService.getMessage().subscribe( (msg: Alert) => {
      this.message = msg;
      // define the sui model message class
      if (this.message && this.message.type === 'error') {
        this.alertClass = [];
        // warning red center aligned
        this.alertClass.push('negative');
      } else {
        this.alertClass = [];
        // uccess teal center aligned
        this.alertClass.push('positive');
      }
    });
  }
}
