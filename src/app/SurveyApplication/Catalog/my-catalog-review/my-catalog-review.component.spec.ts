import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCatalogReviewComponent } from './my-catalog-review.component';

describe('MyCatalogReviewComponent', () => {
  let component: MyCatalogReviewComponent;
  let fixture: ComponentFixture<MyCatalogReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCatalogReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCatalogReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
