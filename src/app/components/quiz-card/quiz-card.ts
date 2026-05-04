import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz } from '../../models/quiz.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-card.html',
  styleUrls: ['./quiz-card.css']
})
export class QuizCardComponent {
  @Input() quiz!: Quiz;
  @Input() showActions = false;
  @Output() edit = new EventEmitter<Quiz>();
  @Output() delete = new EventEmitter<Quiz>();
  @Output() play = new EventEmitter<Quiz>();

  constructor(public authService: AuthService) {}

  onEdit(): void {
    this.edit.emit(this.quiz);
  }

  onDelete(): void {
    if (confirm(`Supprimer le quiz "${this.quiz.title}" ?`)) {
      this.delete.emit(this.quiz);
    }
  }

  onPlay(): void {
    this.play.emit(this.quiz);
  }

  getLevelClass(): string {
    switch (this.quiz.level) {
      case 'Débutant': return 'bg-success';
      case 'Intermédiaire': return 'bg-warning';
      case 'Avancé': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}