import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // <-- AJOUTER CET IMPORT
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../../models/quiz.model';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule],  // <-- AJOUTER CommonModule DANS imports
  templateUrl: './quiz-result.html',  // Vérifiez le nom du fichier
  styleUrls: ['./quiz-result.css']
})
export class QuizResultComponent implements OnInit {
  quiz: Quiz | null = null;
  userAnswers: number[] = [];
  score: number = 0;
  correctAnswers: number = 0;
  timeSpent: number = 0;
  totalQuestions: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      const quiz = this.quizService.getQuizById(quizId);
      this.quiz = quiz || null;
    }
    
    const results = localStorage.getItem('quiz_results');
    if (results) {
      const data = JSON.parse(results);
      this.userAnswers = data.userAnswers;
      this.score = data.score;
      this.correctAnswers = data.correctAnswers;
      this.timeSpent = data.timeSpent;
      this.totalQuestions = data.quiz.questions.length;
      localStorage.removeItem('quiz_results');
    }
    
    if (!this.quiz) {
      this.router.navigate(['/student/quiz-list']);
    }
  }

  getLetter(index: number): string {
    return ['A', 'B', 'C', 'D'][index];
  }

  getFeedback(): string {
    if (this.score >= 80) return 'Excellent ! Continuez comme ça ! 🌟';
    if (this.score >= 60) return 'Très bien ! Vous pouvez encore mieux faire ! 💪';
    if (this.score >= 40) return 'Bon début ! Continuez à vous entraîner ! 📚';
    return 'Il faut réviser ! Ne baissez pas les bras ! 🎯';
  }

  getScoreClass(): string {
    if (this.score >= 80) return 'bg-success';
    if (this.score >= 60) return 'bg-info';
    if (this.score >= 40) return 'bg-warning';
    return 'bg-danger';
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  retryQuiz(): void {
    this.router.navigate(['/student/quiz-play', this.quiz?.id]);
  }

  goHome(): void {
    this.router.navigate(['/student/quiz-list']);
  }
}