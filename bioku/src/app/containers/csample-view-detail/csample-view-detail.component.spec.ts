import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsampleViewDetailComponent } from './csample-view-detail.component';

describe('CsampleViewDetailComponent', () => {
  let component: CsampleViewDetailComponent;
  let fixture: ComponentFixture<CsampleViewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsampleViewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsampleViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
