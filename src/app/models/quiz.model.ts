import { Question } from './question.model';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  ownerId: string;
  ownerName: string;
  questions: Question[];
  createdAt: Date;
}