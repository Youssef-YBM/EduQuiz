import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Quiz } from '../../../models/quiz.model';
import { QuizService } from '../../../services/quiz.service';
import { QuizCardComponent } from '../../../components/quiz-card/quiz-card.component';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, FormsModule, QuizCardComponent],
  templateUrl: './quiz-list.html',
  styleUrls: ['./quiz-list.css']
})


export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  searchTerm: string = '';
  selectedLevel: string = 'Tous';
  levels: string[] = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizzes = this.quizService.getAllQuizzes();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.quizzes];
    
    if (this.searchTerm) {
      filtered = this.quizService.searchQuizzes(this.searchTerm);
    }
    
    if (this.selectedLevel !== 'Tous') {
      filtered = filtered.filter(q => q.level === this.selectedLevel);
    }
    
    this.filteredQuizzes = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onLevelChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedLevel = 'Tous';
    this.loadQuizzes();
  }

  playQuiz(quiz: Quiz): void {
    this.router.navigate(['/student/quiz-play', quiz.id]);
  }
}