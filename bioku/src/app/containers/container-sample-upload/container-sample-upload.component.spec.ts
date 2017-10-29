import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSampleUploadComponent } from './container-sample-upload.component';

describe('ContainerSampleUploadComponent', () => {
  let component: ContainerSampleUploadComponent;
  let fixture: ComponentFixture<ContainerSampleUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerSampleUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSampleUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
