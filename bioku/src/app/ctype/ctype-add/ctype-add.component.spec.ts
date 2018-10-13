import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeAddComponent } from './ctype-add.component';

describe('CtypeAddComponent', () => {
  let component: CtypeAddComponent;
  let fixture: ComponentFixture<CtypeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
