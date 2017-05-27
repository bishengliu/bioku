import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBoxListComponent } from './container-box-list.component';

describe('ContainerBoxListComponent', () => {
  let component: ContainerBoxListComponent;
  let fixture: ComponentFixture<ContainerBoxListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerBoxListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerBoxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
