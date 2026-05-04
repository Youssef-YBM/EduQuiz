export interface Score {
  id: string;
  userId: string;
  userName: string;
  quizId: string;
  quizTitle: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  date: Date;
  timeSpent?: number;
}