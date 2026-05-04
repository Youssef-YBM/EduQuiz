import { Injectable } from '@angular/core';
import { Score } from '../models/score.model';
import { AuthService } from './auth.service';
import { QuizService } from './quiz.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private readonly STORAGE_KEY = 'eduquiz_scores';
  private scores: Score[] = [];

  constructor(
    private authService: AuthService,
    private quizService: QuizService
  ) {
    this.loadScores();
  }

  private loadScores(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    this.scores = stored ? JSON.parse(stored) : [];
  }

  private saveScores(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.scores));
  }

  saveScore(score: Omit<Score, 'id'>): Score {
    const newScore: Score = {
      ...score,
      id: 'score_' + Date.now() + '_' + Math.random()
    };
    
    this.scores.push(newScore);
    this.saveScores();
    return newScore;
  }

  getScoresByUser(userId: string): Score[] {
    return this.scores.filter(s => s.userId === userId).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  getScoresByQuiz(quizId: string): Score[] {
    return this.scores.filter(s => s.quizId === quizId).sort((a, b) => b.score - a.score);
  }

  getAllScores(): Score[] {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser?.role === 'admin') {
      return [...this.scores];
    } else if (currentUser?.role === 'teacher') {
      const teacherQuizzes = this.quizService.getQuizzesByOwner(currentUser.id);
      const teacherQuizIds = teacherQuizzes.map(q => q.id);
      return this.scores.filter(s => teacherQuizIds.includes(s.quizId));
    } else {
      return this.getScoresByUser(currentUser?.id || '');
    }
  }

  getLeaderboard(): Score[] {
    const allScores = [...this.scores];
    const bestScoresByUser = new Map<string, Score>();
    
    allScores.forEach(score => {
      const existing = bestScoresByUser.get(score.userId);
      if (!existing || score.score > existing.score) {
        bestScoresByUser.set(score.userId, score);
      }
    });
    
    return Array.from(bestScoresByUser.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  getUserStatistics(userId: string): {
    totalQuizzes: number;
    averageScore: number;
    bestScore: number;
    totalQuestions: number;
  } {
    const userScores = this.getScoresByUser(userId);
    
    if (userScores.length === 0) {
      return { totalQuizzes: 0, averageScore: 0, bestScore: 0, totalQuestions: 0 };
    }
    
    const totalScore = userScores.reduce((sum, s) => sum + s.score, 0);
    const totalQuestions = userScores.reduce((sum, s) => sum + s.totalQuestions, 0);
    
    return {
      totalQuizzes: userScores.length,
      averageScore: Math.round(totalScore / userScores.length),
      bestScore: Math.max(...userScores.map(s => s.score)),
      totalQuestions: totalQuestions
    };
  }
}