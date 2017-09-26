import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleSearchResultComponent } from './sample-search-result.component';

describe('SampleSearchResultComponent', () => {
  let component: SampleSearchResultComponent;
  let fixture: ComponentFixture<SampleSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleSearchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
