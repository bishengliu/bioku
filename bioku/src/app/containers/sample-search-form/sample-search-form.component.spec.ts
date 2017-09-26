import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleSearchFormComponent } from './sample-search-form.component';

describe('SampleSearchFormComponent', () => {
  let component: SampleSearchFormComponent;
  let fixture: ComponentFixture<SampleSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
