import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBoxNavbarComponent } from './container-box-navbar.component';

describe('ContainerBoxNavbarComponent', () => {
  let component: ContainerBoxNavbarComponent;
  let fixture: ComponentFixture<ContainerBoxNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerBoxNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerBoxNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
