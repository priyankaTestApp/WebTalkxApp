import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuestionsTabComponent } from './my-questions-tab.component';

describe('MyQuestionsTabComponent', () => {
  let component: MyQuestionsTabComponent;
  let fixture: ComponentFixture<MyQuestionsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyQuestionsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyQuestionsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
