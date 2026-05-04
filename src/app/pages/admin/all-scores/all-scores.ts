import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Score } from '../../../models/score.model';
import { ScoreService } from '../../../services/score.service';

@Component({
  selector: 'app-all-scores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-scores.html',
  styleUrls: ['./all-scores.css']
})


export class AllScoresComponent implements OnInit {
  scores: Score[] = [];

  constructor(private scoreService: ScoreService) {}

  ngOnInit(): void {
    this.loadScores();
  }

  loadScores(): void {
    this.scores = this.scoreService.getAllScores();
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