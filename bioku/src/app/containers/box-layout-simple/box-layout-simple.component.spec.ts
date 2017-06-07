import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxLayoutSimpleComponent } from './box-layout-simple.component';

describe('BoxLayoutSimpleComponent', () => {
  let component: BoxLayoutSimpleComponent;
  let fixture: ComponentFixture<BoxLayoutSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxLayoutSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxLayoutSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
