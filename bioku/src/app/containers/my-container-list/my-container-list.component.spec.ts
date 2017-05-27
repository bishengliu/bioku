import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyContainerListComponent } from './my-container-list.component';

describe('MyContainerListComponent', () => {
  let component: MyContainerListComponent;
  let fixture: ComponentFixture<MyContainerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyContainerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyContainerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
