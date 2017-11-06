import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSampleUploaderValidateSaveComponent } from './container-sample-uploader-validate-save.component';

describe('ContainerSampleUploaderValidateSaveComponent', () => {
  let component: ContainerSampleUploaderValidateSaveComponent;
  let fixture: ComponentFixture<ContainerSampleUploaderValidateSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerSampleUploaderValidateSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSampleUploaderValidateSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
