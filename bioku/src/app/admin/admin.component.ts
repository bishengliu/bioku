import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  gCount: number = 0;
  constructor() { }

  ngOnInit() {
    //list all the groups with researchers in each group
    console.log(this.gCount);
  }

}
