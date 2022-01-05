import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCatalogModalComponent } from './user-catalog-modal.component';

describe('UserCatalogModalComponent', () => {
  let component: UserCatalogModalComponent;
  let fixture: ComponentFixture<UserCatalogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCatalogModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCatalogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
