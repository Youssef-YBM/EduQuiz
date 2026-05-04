import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Quiz } from '../../../models/quiz.model';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-all-quizzes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-quizzes.html',
  styleUrls: ['./all-quizzes.css']
})


export class AllQuizzesComponent implements OnInit {
  quizzes: Quiz[] = [];

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizzes = this.quizService.getAllQuizzes();
  }

  editQuiz(quiz: Quiz): void {
    this.router.navigate(['/teacher/quiz-form', quiz.id]);
  }

  deleteQuiz(quiz: Quiz): void {
    if (confirm(`Supprimer le quiz "${quiz.title}" ?`)) {
      this.quizService.deleteQuiz(quiz.id);
      this.loadQuizzes();
    }
  }

  getLevelClass(level: string): string {
    switch (level) {
      case 'Débutant': return 'bg-success';
      case 'Intermédiaire': return 'bg-warning';
      case 'Avancé': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}