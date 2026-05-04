import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllScores } from './all-scores';

describe('AllScores', () => {
  let component: AllScores;
  let fixture: ComponentFixture<AllScores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllScores],
    }).compileComponents();

    fixture = TestBed.createComponent(AllScores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
