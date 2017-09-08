import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveSampleComponent } from './move-sample.component';

describe('MoveSampleComponent', () => {
  let component: MoveSampleComponent;
  let fixture: ComponentFixture<MoveSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
