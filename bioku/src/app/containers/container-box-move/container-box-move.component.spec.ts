import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBoxMoveComponent } from './container-box-move.component';

describe('ContainerBoxMoveComponent', () => {
  let component: ContainerBoxMoveComponent;
  let fixture: ComponentFixture<ContainerBoxMoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerBoxMoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerBoxMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
