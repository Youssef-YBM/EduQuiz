import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuizzes } from './my-quizzes';

describe('MyQuizzes', () => {
  let component: MyQuizzes;
  let fixture: ComponentFixture<MyQuizzes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyQuizzes],
    }).compileComponents();

    fixture = TestBed.createComponent(MyQuizzes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
