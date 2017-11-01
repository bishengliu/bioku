import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSampleUploaderStepThreeComponent } from './container-sample-uploader-step-three.component';

describe('ContainerSampleUploaderStepThreeComponent', () => {
  let component: ContainerSampleUploaderStepThreeComponent;
  let fixture: ComponentFixture<ContainerSampleUploaderStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerSampleUploaderStepThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSampleUploaderStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
