import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // <-- ÉTAPE 1: Importer CommonModule
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Quiz } from '../../../models/quiz.model';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-my-quizzes',
  standalone: true,
  imports: [CommonModule, RouterModule],  // <-- ÉTAPE 2: Ajouter CommonModule
  templateUrl: './my-quizzes.html',  // <-- Vérifiez le nom du fichier
  styleUrls: ['./my-quizzes.css']
})
export class MyQuizzesComponent implements OnInit {
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

  createQuiz(): void {
    this.router.navigate(['/teacher/quiz-form/new']);
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