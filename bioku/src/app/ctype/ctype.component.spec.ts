import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeComponent } from './ctype.component';

describe('CtypeComponent', () => {
  let component: CtypeComponent;
  let fixture: ComponentFixture<CtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
