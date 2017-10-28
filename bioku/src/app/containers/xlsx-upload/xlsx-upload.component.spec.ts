import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XlsxUploadComponent } from './xlsx-upload.component';

describe('XlsxUploadComponent', () => {
  let component: XlsxUploadComponent;
  let fixture: ComponentFixture<XlsxUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XlsxUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XlsxUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
