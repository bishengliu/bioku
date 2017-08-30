import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerAddBoxComponent } from './container-add-box.component';

describe('ContainerAddBoxComponent', () => {
  let component: ContainerAddBoxComponent;
  let fixture: ComponentFixture<ContainerAddBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerAddBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerAddBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
