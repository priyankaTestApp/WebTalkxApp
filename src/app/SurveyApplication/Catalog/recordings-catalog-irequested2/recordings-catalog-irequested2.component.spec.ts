import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingsCatalogIRequested2Component } from './recordings-catalog-irequested2.component';

describe('RecordingsCatalogIRequested2Component', () => {
  let component: RecordingsCatalogIRequested2Component;
  let fixture: ComponentFixture<RecordingsCatalogIRequested2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingsCatalogIRequested2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingsCatalogIRequested2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
