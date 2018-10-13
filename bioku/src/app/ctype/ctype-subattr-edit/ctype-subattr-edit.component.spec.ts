import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeSubattrEditComponent } from './ctype-subattr-edit.component';

describe('CtypeSubattrEditComponent', () => {
  let component: CtypeSubattrEditComponent;
  let fixture: ComponentFixture<CtypeSubattrEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeSubattrEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeSubattrEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
