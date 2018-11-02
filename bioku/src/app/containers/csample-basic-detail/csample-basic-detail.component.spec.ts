import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsampleBasicDetailComponent } from './csample-basic-detail.component';

describe('CsampleBasicDetailComponent', () => {
  let component: CsampleBasicDetailComponent;
  let fixture: ComponentFixture<CsampleBasicDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsampleBasicDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsampleBasicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
