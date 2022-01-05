import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayPlayerModalComponent } from './replay-player-modal.component';

describe('ReplayPlayerModalComponent', () => {
  let component: ReplayPlayerModalComponent;
  let fixture: ComponentFixture<ReplayPlayerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplayPlayerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplayPlayerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
