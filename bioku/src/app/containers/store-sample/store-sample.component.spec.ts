import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSampleComponent } from './store-sample.component';

describe('StoreSampleComponent', () => {
  let component: StoreSampleComponent;
  let fixture: ComponentFixture<StoreSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
