import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBoxesFilterComponent } from './container-boxes-filter.component';

describe('ContainerBoxesFilterComponent', () => {
  let component: ContainerBoxesFilterComponent;
  let fixture: ComponentFixture<ContainerBoxesFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerBoxesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerBoxesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
