import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../../models/quiz.model';
import { Question } from '../../../models/question.model';
import { Score } from '../../../models/score.model';
import { QuizService } from '../../../services/quiz.service';
import { ScoreService } from '../../../services/score.service';
import { AuthService } from '../../../services/auth.service';
import { TimerComponent } from '../../../components/timer/timer.component';

@Component({
  selector: 'app-quiz-play',
  standalone: true,
  imports: [CommonModule, TimerComponent],
  templateUrl: './quiz-play.html',
  styleUrls: ['./quiz-play.css']
})
export class QuizPlayComponent implements OnInit, OnDestroy {
  quiz: Quiz | null = null;
  currentQuestionIndex: number = 0;
  userAnswers: number[] = [];
  showAnswerFeedback: boolean = false;
  selectedAnswerIndex: number = -1;
  quizCompleted: boolean = false;
  timeUp: boolean = false;
  startTime: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private scoreService: ScoreService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      // CORRECTION: Convertir undefined en null
      const quiz = this.quizService.getQuizById(quizId);
      this.quiz = quiz || null;
    }
    
    if (!this.quiz) {
      this.router.navigate(['/student/quiz-list']);
    } else {
      this.userAnswers = new Array(this.quiz.questions.length).fill(-1);
      this.startTime = new Date();
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  get currentQuestion(): Question | null {
    return this.quiz ? this.quiz.questions[this.currentQuestionIndex] : null;
  }

  getLetter(index: number): string {
    return ['A', 'B', 'C', 'D'][index];
  }

  selectAnswer(answerIndex: number): void {
    if (this.showAnswerFeedback) return;
    this.selectedAnswerIndex = answerIndex;
  }

  validateAnswer(): void {
    if (this.selectedAnswerIndex === -1) return;
    this.userAnswers[this.currentQuestionIndex] = this.selectedAnswerIndex;
    this.showAnswerFeedback = true;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex + 1 < (this.quiz?.questions.length || 0)) {
      this.currentQuestionIndex++;
      this.selectedAnswerIndex = -1;
      this.showAnswerFeedback = false;
    } else {
      this.completeQuiz();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedAnswerIndex = this.userAnswers[this.currentQuestionIndex];
      this.showAnswerFeedback = this.selectedAnswerIndex !== -1;
    }
  }

  completeQuiz(): void {
    if (!this.quiz) return;
    
    const totalQuestions = this.quiz.questions.length;
    let correctAnswers = 0;
    
    this.userAnswers.forEach((answer, index) => {
      if (answer === this.quiz!.questions[index].correctIndex) {
        correctAnswers++;
      }
    });
    
    const score = (correctAnswers / totalQuestions) * 100;
    const timeSpent = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
    
    const scoreRecord: Omit<Score, 'id'> = {
      userId: this.authService.getCurrentUser()?.id || '',
      userName: this.authService.getCurrentUser()?.name || '',
      quizId: this.quiz.id,
      quizTitle: this.quiz.title,
      score: score,
      correctAnswers: correctAnswers,
      totalQuestions: totalQuestions,
      date: new Date(),
      timeSpent: timeSpent
    };
    
    this.scoreService.saveScore(scoreRecord);
    this.quizCompleted = true;
    
    localStorage.setItem('quiz_results', JSON.stringify({
      quiz: this.quiz,
      userAnswers: this.userAnswers,
      score: score,
      correctAnswers: correctAnswers,
      timeSpent: timeSpent
    }));
    
    this.router.navigate(['/student/quiz-result', this.quiz.id]);
  }

  onTimeUp(): void {
    this.timeUp = true;
    this.completeQuiz();
  }

  getProgressPercentage(): number {
    if (!this.quiz) return 0;
    return ((this.currentQuestionIndex + 1) / this.quiz.questions.length) * 100;
  }

  isCorrect(currentAnswer: number, questionIndex: number): boolean {
    if (!this.quiz) return false;
    return currentAnswer === this.quiz.questions[questionIndex].correctIndex;
  }
}