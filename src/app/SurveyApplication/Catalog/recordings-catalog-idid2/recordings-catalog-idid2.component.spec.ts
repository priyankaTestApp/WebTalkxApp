import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingsCatalogIDid2Component } from './recordings-catalog-idid2.component';

describe('RecordingsCatalogIDid2Component', () => {
  let component: RecordingsCatalogIDid2Component;
  let fixture: ComponentFixture<RecordingsCatalogIDid2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingsCatalogIDid2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingsCatalogIDid2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
