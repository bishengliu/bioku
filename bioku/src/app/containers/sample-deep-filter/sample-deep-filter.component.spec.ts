import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleDeepFilterComponent } from './sample-deep-filter.component';

describe('SampleDeepFilterComponent', () => {
  let component: SampleDeepFilterComponent;
  let fixture: ComponentFixture<SampleDeepFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleDeepFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDeepFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
