import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sample-search-action-panel',
  templateUrl: './sample-search-action-panel.component.html',
  styleUrls: ['./sample-search-action-panel.component.css']
})
export class SampleSearchActionPanelComponent implements OnInit {
  @Input() selectedSamples: Array<number>;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(){
    console.log(this.selectedSamples);
  }
}
