import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeSubattrDeleteComponent } from './ctype-subattr-delete.component';

describe('CtypeSubattrDeleteComponent', () => {
  let component: CtypeSubattrDeleteComponent;
  let fixture: ComponentFixture<CtypeSubattrDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeSubattrDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeSubattrDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
