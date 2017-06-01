import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxDetailActionPanelComponent } from './box-detail-action-panel.component';

describe('BoxDetailActionPanelComponent', () => {
  let component: BoxDetailActionPanelComponent;
  let fixture: ComponentFixture<BoxDetailActionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxDetailActionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxDetailActionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
