import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceCatalogComponent } from './compliance-catalog.component';

describe('ComplianceCatalogComponent', () => {
  let component: ComplianceCatalogComponent;
  let fixture: ComponentFixture<ComplianceCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceCatalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
