import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBoxAddComponent } from './container-box-add.component';

describe('ContainerBoxAddComponent', () => {
  let component: ContainerBoxAddComponent;
  let fixture: ComponentFixture<ContainerBoxAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerBoxAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerBoxAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
