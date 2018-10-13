import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeSubattrListComponent } from './ctype-subattr-list.component';

describe('CtypeSubattrListComponent', () => {
  let component: CtypeSubattrListComponent;
  let fixture: ComponentFixture<CtypeSubattrListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeSubattrListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeSubattrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
