import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtypeDetailComponent } from './ctype-detail.component';

describe('CtypeDetailComponent', () => {
  let component: CtypeDetailComponent;
  let fixture: ComponentFixture<CtypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
