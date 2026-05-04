import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Score } from '../../models/score.model';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.css']
})


export class LeaderboardComponent implements OnInit {
  leaderboard: Score[] = [];

  constructor(private scoreService: ScoreService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.leaderboard = this.scoreService.getLeaderboard();
  }

  getMedal(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  }

  getScoreBadge(score: number): string {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-info';
    if (score >= 40) return 'bg-warning';
    return 'bg-danger';
  }
}