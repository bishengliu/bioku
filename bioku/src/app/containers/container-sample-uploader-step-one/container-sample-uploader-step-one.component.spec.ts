import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSampleUploaderStepOneComponent } from './container-sample-uploader-step-one.component';

describe('ContainerSampleUploaderStepOneComponent', () => {
  let component: ContainerSampleUploaderStepOneComponent;
  let fixture: ComponentFixture<ContainerSampleUploaderStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerSampleUploaderStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSampleUploaderStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
