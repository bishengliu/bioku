import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeListComponent } from './ctype-list.component';

describe('CtypeListComponent', () => {
  let component: CtypeListComponent;
  let fixture: ComponentFixture<CtypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
