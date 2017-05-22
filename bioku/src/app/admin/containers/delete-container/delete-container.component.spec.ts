import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteContainerComponent } from './delete-container.component';

describe('DeleteContainerComponent', () => {
  let component: DeleteContainerComponent;
  let fixture: ComponentFixture<DeleteContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
