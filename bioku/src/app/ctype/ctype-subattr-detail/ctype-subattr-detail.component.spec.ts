import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeSubattrDetailComponent } from './ctype-subattr-detail.component';

describe('CtypeSubattrDetailComponent', () => {
  let component: CtypeSubattrDetailComponent;
  let fixture: ComponentFixture<CtypeSubattrDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeSubattrDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeSubattrDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
