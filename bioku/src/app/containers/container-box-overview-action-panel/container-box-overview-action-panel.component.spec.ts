import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBoxOverviewActionPanelComponent } from './container-box-overview-action-panel.component';

describe('ContainerBoxOverviewActionPanelComponent', () => {
  let component: ContainerBoxOverviewActionPanelComponent;
  let fixture: ComponentFixture<ContainerBoxOverviewActionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerBoxOverviewActionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerBoxOverviewActionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
