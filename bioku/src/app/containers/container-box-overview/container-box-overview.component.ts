import { Component, OnInit, Inject, Input } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { Container } from '../../_classes/Container';
import { ContainerTower, Containershelf, BoxAvailability } from '../../_classes/ContainerTower';

@Component({
  selector: 'app-container-box-overview',
  templateUrl: './container-box-overview.component.html',
  styleUrls: ['./container-box-overview.component.css']
})
export class ContainerBoxOverviewComponent implements OnInit {
  @Input() container: Container;
  @Input() towers: Array<ContainerTower>;

  _towers: Array<ContainerTower>;
  constructor() { }

  ngOnInit() {
    console.log('----------------------');
    console.log(this.container);
    console.log(this.towers);
    console.log('----------------------');
  }

  ngOnChanges(change: SimpleChanges){
    if(change['towers']){
      console.log(change['towers']);
    }
  }
}
