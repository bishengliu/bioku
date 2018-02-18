import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleDetailModelComponent } from './sample-detail-model.component';

describe('SampleDetailModelComponent', () => {
  let component: SampleDetailModelComponent;
  let fixture: ComponentFixture<SampleDetailModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleDetailModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDetailModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
