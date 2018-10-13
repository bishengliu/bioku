import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeAttrEditComponent } from './ctype-attr-edit.component';

describe('CtypeAttrEditComponent', () => {
  let component: CtypeAttrEditComponent;
  let fixture: ComponentFixture<CtypeAttrEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeAttrEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeAttrEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
