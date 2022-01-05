import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityCatalogComponent } from './security-catalog.component';

describe('SecurityCatalogComponent', () => {
  let component: SecurityCatalogComponent;
  let fixture: ComponentFixture<SecurityCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityCatalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
