import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeAttrDetailComponent } from './ctype-attr-detail.component';

describe('CtypeAttrDetailComponent', () => {
  let component: CtypeAttrDetailComponent;
  let fixture: ComponentFixture<CtypeAttrDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeAttrDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeAttrDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
