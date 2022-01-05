import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingsCatalogTestComponent } from './recordings-catalog-test.component';

describe('RecordingsCatalogTestComponent', () => {
  let component: RecordingsCatalogTestComponent;
  let fixture: ComponentFixture<RecordingsCatalogTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingsCatalogTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingsCatalogTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
