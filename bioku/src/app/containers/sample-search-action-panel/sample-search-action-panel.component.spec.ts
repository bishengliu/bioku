import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleSearchActionPanelComponent } from './sample-search-action-panel.component';

describe('SampleSearchActionPanelComponent', () => {
  let component: SampleSearchActionPanelComponent;
  let fixture: ComponentFixture<SampleSearchActionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleSearchActionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleSearchActionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
