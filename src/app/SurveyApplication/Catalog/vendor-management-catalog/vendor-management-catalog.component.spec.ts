import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorManagementCatalogComponent } from './vendor-management-catalog.component';

describe('VendorManagementCatalogComponent', () => {
  let component: VendorManagementCatalogComponent;
  let fixture: ComponentFixture<VendorManagementCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorManagementCatalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorManagementCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
