import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingsCatalogForMyReview2Component } from './recordings-catalog-for-my-review2.component';

describe('RecordingsCatalogForMyReview2Component', () => {
  let component: RecordingsCatalogForMyReview2Component;
  let fixture: ComponentFixture<RecordingsCatalogForMyReview2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingsCatalogForMyReview2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingsCatalogForMyReview2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
