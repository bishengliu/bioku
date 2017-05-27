import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainersSiderbarComponent } from './containers-siderbar.component';

describe('ContainersSiderbarComponent', () => {
  let component: ContainersSiderbarComponent;
  let fixture: ComponentFixture<ContainersSiderbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainersSiderbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainersSiderbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
