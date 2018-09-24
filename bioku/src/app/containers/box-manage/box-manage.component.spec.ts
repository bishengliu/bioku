import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxManageComponent } from './box-manage.component';

describe('BoxManageComponent', () => {
  let component: BoxManageComponent;
  let fixture: ComponentFixture<BoxManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
