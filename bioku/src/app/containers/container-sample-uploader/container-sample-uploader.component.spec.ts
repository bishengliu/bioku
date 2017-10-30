import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSampleUploaderComponent } from './container-sample-uploader.component';

describe('ContainerSampleUploaderComponent', () => {
  let component: ContainerSampleUploaderComponent;
  let fixture: ComponentFixture<ContainerSampleUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerSampleUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSampleUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
