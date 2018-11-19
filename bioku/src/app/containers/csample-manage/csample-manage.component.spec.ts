import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsampleManageComponent } from './csample-manage.component';

describe('CsampleManageComponent', () => {
  let component: CsampleManageComponent;
  let fixture: ComponentFixture<CsampleManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsampleManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsampleManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
