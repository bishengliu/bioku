import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBoxFullnessviewComponent } from './container-box-fullnessview.component';

describe('ContainerBoxFullnessviewComponent', () => {
  let component: ContainerBoxFullnessviewComponent;
  let fixture: ComponentFixture<ContainerBoxFullnessviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerBoxFullnessviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerBoxFullnessviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
