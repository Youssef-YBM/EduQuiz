import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Quiz } from '../../../models/quiz.model';
import { Score } from '../../../models/score.model';
import { QuizService } from '../../../services/quiz.service';
import { ScoreService } from '../../../services/score.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-quiz-scores',
  standalone: true,  // <-- AJOUTER standalone: true
  imports: [CommonModule, FormsModule],  // <-- IMPORTER CommonModule
  templateUrl: './quiz-scores.html',
  styleUrls: ['./quiz-scores.css']
})
export class QuizScoresComponent implements OnInit {
  quizzes: Quiz[] = [];
  selectedQuizId: string = '';
  scores: Score[] = [];
  selectedQuizTitle: string = '';

  constructor(
    private quizService: QuizService,
    private scoreService: ScoreService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizzes = this.quizService.getAllQuizzes();
  }

  onQuizChange(): void {
    if (this.selectedQuizId) {
      this.scores = this.scoreService.getScoresByQuiz(this.selectedQuizId);
      const quiz = this.quizzes.find(q => q.id === this.selectedQuizId);
      this.selectedQuizTitle = quiz?.title || '';
    } else {
      this.scores = [];
      this.selectedQuizTitle = '';
    }
  }

  getScoreBadge(score: number): string {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-info';
    if (score >= 40) return 'bg-warning';
    return 'bg-danger';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}