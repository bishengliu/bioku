import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeSubattrAddComponent } from './ctype-subattr-add.component';

describe('CtypeSubattrAddComponent', () => {
  let component: CtypeSubattrAddComponent;
  let fixture: ComponentFixture<CtypeSubattrAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeSubattrAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeSubattrAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
