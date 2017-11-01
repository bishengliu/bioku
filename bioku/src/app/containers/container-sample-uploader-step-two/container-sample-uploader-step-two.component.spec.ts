import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSampleUploaderStepTwoComponent } from './container-sample-uploader-step-two.component';

describe('ContainerSampleUploaderStepTwoComponent', () => {
  let component: ContainerSampleUploaderStepTwoComponent;
  let fixture: ComponentFixture<ContainerSampleUploaderStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerSampleUploaderStepTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSampleUploaderStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
