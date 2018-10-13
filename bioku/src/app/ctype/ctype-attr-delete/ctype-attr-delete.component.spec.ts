import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeAttrDeleteComponent } from './ctype-attr-delete.component';

describe('CtypeAttrDeleteComponent', () => {
  let component: CtypeAttrDeleteComponent;
  let fixture: ComponentFixture<CtypeAttrDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeAttrDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeAttrDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
