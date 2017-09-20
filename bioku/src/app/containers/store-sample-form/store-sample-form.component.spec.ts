import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSampleFormComponent } from './store-sample-form.component';

describe('StoreSampleFormComponent', () => {
  let component: StoreSampleFormComponent;
  let fixture: ComponentFixture<StoreSampleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreSampleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSampleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
