import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizScores } from './quiz-scores';

describe('QuizScores', () => {
  let component: QuizScores;
  let fixture: ComponentFixture<QuizScores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizScores],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizScores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
