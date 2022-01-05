import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonRecordingCatalogComponent } from './common-recording-catalog.component';

describe('CommonRecordingCatalogComponent', () => {
  let component: CommonRecordingCatalogComponent;
  let fixture: ComponentFixture<CommonRecordingCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonRecordingCatalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonRecordingCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
