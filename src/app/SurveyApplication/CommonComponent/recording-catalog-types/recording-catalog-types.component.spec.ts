import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingCatalogTypesComponent } from './recording-catalog-types.component';

describe('RecordingCatalogTypesComponent', () => {
  let component: RecordingCatalogTypesComponent;
  let fixture: ComponentFixture<RecordingCatalogTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingCatalogTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingCatalogTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
