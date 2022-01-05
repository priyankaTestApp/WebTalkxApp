import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSurveyCatalogComponent } from './employee-survey-catalog.component';

describe('EmployeeSurveyCatalogComponent', () => {
  let component: EmployeeSurveyCatalogComponent;
  let fixture: ComponentFixture<EmployeeSurveyCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSurveyCatalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSurveyCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
