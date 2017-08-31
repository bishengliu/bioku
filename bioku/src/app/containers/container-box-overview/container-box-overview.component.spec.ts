import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBoxOverviewComponent } from './container-box-overview.component';

describe('ContainerBoxOverviewComponent', () => {
  let component: ContainerBoxOverviewComponent;
  let fixture: ComponentFixture<ContainerBoxOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerBoxOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerBoxOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
