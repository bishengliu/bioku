import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerOverviewComponent } from './container-overview.component';

describe('ContainerOverviewComponent', () => {
  let component: ContainerOverviewComponent;
  let fixture: ComponentFixture<ContainerOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
