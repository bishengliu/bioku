import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleViewDetailComponent } from './sample-view-detail.component';

describe('SampleViewDetailComponent', () => {
  let component: SampleViewDetailComponent;
  let fixture: ComponentFixture<SampleViewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleViewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
