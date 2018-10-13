import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeAttrListComponent } from './ctype-attr-list.component';

describe('CtypeAttrListComponent', () => {
  let component: CtypeAttrListComponent;
  let fixture: ComponentFixture<CtypeAttrListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeAttrListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeAttrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
