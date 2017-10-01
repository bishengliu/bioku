import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Sample } from '../../_classes/Sample';
import { ContainerService } from '../../_services/ContainerService';
import {  AlertService } from '../../_services/AlertService';
@Component({
  selector: 'app-sample-search-action-panel',
  templateUrl: './sample-search-action-panel.component.html',
  styleUrls: ['./sample-search-action-panel.component.css']
})
export class SampleSearchActionPanelComponent implements OnInit {
  @Input() selectedSamples: Array<Sample>;
  @Input() selectedSamplePks: Array<number>;

  occupiedSamples: Array<Sample> = new Array<Sample>();
  preoccupiedSamples: Array<Sample> = new Array<Sample>();
  //show panel content
  show_panel_content: boolean = false;
  constructor(private router: Router,private containerService: ContainerService, private alertService: AlertService) { }

  ngOnInit() {
  }

  splitSample(){
    if(this.selectedSamples != null && this.selectedSamplePks != null){
      this.occupiedSamples = this.selectedSamples.filter((s:Sample)=> s.occupied == true && s.date_out == null);
      this.preoccupiedSamples = this.selectedSamples.filter((s:Sample)=> s.occupied != true && s.date_out != null);
    } 
  }
  ngOnChanges(){
    this.splitSample();
    //console.log(this.selectedSamples);
    //console.log(this.selectedSamplePks);
  }
  hidePanelContent(){
    this.show_panel_content = false;
  }

  showPanelContent(){
    this.show_panel_content = true;
  }
  togglePanelContent(){
    this.show_panel_content = !this.show_panel_content;
  }
  //take multiple sample out
  takeMultipleSampleout() {
    let today = new Date()
    let date_out = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let failed_samples = '';
    let count: number = 0;
    let total = this.occupiedSamples.length;
    if (total > 0) {
      let sample_token_out: boolean = true;
      this.occupiedSamples.forEach((sample, i) => {
        count++;
        this.containerService.takeSampleOut(sample.container_id, sample.box_position, sample.position)
          .subscribe(() => {
            sample.occupied = false;
            if (count == total) {
              if (sample_token_out) {
                this.alertService.success("All samples token out!", true);
              }
              this.updateTakeoutSample(sample);
            }
          }, (err) => {
            sample_token_out = false;
            console.log(err);
            failed_samples = sample.box + "/"+sample.position;
            if (count == total) {
              this.alertService.error("Something went wrong, failed to take out samples at: " + failed_samples + "!", true);
            }
          });
      });
    }
  }

  updateTakeoutSample(sample:Sample){
    this.occupiedSamples = [...this.occupiedSamples.filter((s:Sample)=>{return s.pk != sample.pk})];
    this.preoccupiedSamples = [...this.preoccupiedSamples, sample];
  }
  
  //put multiple sample back
  putMultipleSampleBack() {
    // console.log(this.preoccupiedSamples);
    let failed_samples = '';
    let count: number = 0;
    let total = this.preoccupiedSamples.length;
    if (total > 0) {
      let sample_put_back: boolean = true;
      this.preoccupiedSamples.forEach((sample, i) => {
        count++;
        this.containerService.putSampleBack(sample.container_id, sample.box_position, sample.position)
          .subscribe(() => {
            sample.occupied = true;
            if (count == total) {
              if (sample_put_back) {
                this.alertService.success("All samples put back!", true);
              }
              this.updatePutBackSample(sample);
            }
          }, (err) => {
            console.log(err);
            sample_put_back = false;
            failed_samples = sample.box + "/"+sample.position;
            if (count == total) {
              this.alertService.error("Something went wrong, failed to put back samples at: " + failed_samples + "!", true);
            }
          });
      });
    }
  }

  updatePutBackSample(sample:Sample){
    this.preoccupiedSamples = [...this.preoccupiedSamples.filter((s:Sample)=>{return s.pk != sample.pk})];
    this.occupiedSamples = [...this.occupiedSamples, sample];
  }
}
