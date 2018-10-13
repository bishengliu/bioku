import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeEditComponent } from './ctype-edit.component';

describe('CtypeEditComponent', () => {
  let component: CtypeEditComponent;
  let fixture: ComponentFixture<CtypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
