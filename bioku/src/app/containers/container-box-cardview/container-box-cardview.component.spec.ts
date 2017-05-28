import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBoxCardviewComponent } from './container-box-cardview.component';

describe('ContainerBoxCardviewComponent', () => {
  let component: ContainerBoxCardviewComponent;
  let fixture: ComponentFixture<ContainerBoxCardviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerBoxCardviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerBoxCardviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
