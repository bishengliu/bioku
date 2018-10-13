import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeDeleteComponent } from './ctype-delete.component';

describe('CtypeDeleteComponent', () => {
  let component: CtypeDeleteComponent;
  let fixture: ComponentFixture<CtypeDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
