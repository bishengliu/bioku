import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSampleUploadHelperComponent } from './container-sample-upload-helper.component';

describe('ContainerSampleUploadHelperComponent', () => {
  let component: ContainerSampleUploadHelperComponent;
  let fixture: ComponentFixture<ContainerSampleUploadHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerSampleUploadHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSampleUploadHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
