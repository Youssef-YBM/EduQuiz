export interface Question {
  id: string;
  text: string;
  answers: string[];
  correctIndex: number;
  explanation?: string;
}