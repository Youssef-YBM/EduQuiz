import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Score } from '../../../models/score.model';
import { ScoreService } from '../../../services/score.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})


export class HistoryComponent implements OnInit {
  scores: Score[] = [];
  statistics = {
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    totalQuestions: 0
  };

  constructor(
    private scoreService: ScoreService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.scores = this.scoreService.getScoresByUser(user.id);
      this.statistics = this.scoreService.getUserStatistics(user.id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  getScoreBadge(score: number): string {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-info';
    if (score >= 40) return 'bg-warning';
    return 'bg-danger';
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}