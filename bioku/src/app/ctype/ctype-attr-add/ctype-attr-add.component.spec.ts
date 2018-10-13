import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeAttrAddComponent } from './ctype-attr-add.component';

describe('CtypeAttrAddComponent', () => {
  let component: CtypeAttrAddComponent;
  let fixture: ComponentFixture<CtypeAttrAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeAttrAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeAttrAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
