import { Injectable } from '@angular/core';
import { Quiz } from '../models/quiz.model';
import { Question } from '../models/question.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly STORAGE_KEY = 'eduquiz_quizzes';
  private quizzes: Quiz[] = [];

  constructor(private authService: AuthService) {
    this.loadQuizzes();
    this.initializeDefaultQuizzes();
  }

  private loadQuizzes(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    this.quizzes = stored ? JSON.parse(stored) : [];
  }

  private saveQuizzes(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.quizzes));
  }

  private initializeDefaultQuizzes(): void {
    if (this.quizzes.length > 0) return;

    const defaultQuestions: Question[] = [
      {
        id: 'q1',
        text: 'Quelle est la commande pour créer un nouveau projet Angular ?',
        answers: ['ng start', 'ng new', 'ng create', 'ng init'],
        correctIndex: 1,
        explanation: 'La commande "ng new" crée un nouveau projet Angular.'
      },
      {
        id: 'q2',
        text: 'Quel fichier contient les dépendances du projet Angular ?',
        answers: ['angular.json', 'app.module.ts', 'package.json', 'tsconfig.json'],
        correctIndex: 2,
        explanation: 'package.json contient toutes les dépendances npm du projet.'
      },
      {
        id: 'q3',
        text: 'À quoi sert le routing dans Angular ?',
        answers: [
          'À styliser les composants',
          'À naviguer entre les pages',
          'À gérer les formulaires',
          'À faire des appels API'
        ],
        correctIndex: 1,
        explanation: 'Le routing permet la navigation entre différentes vues/composants.'
      }
    ];

    const teacher = this.authService.getAllUsers().find(u => u.role === 'teacher');
    
    this.quizzes = [
      {
        id: 'quiz1',
        title: 'Angular Fondamentaux',
        description: 'Testez vos connaissances sur les bases d\'Angular',
        level: 'Débutant',
        ownerId: teacher?.id || 'teacher1',
        ownerName: teacher?.name || 'Pierre Teacher',
        questions: defaultQuestions,
        createdAt: new Date()
      },
      {
        id: 'quiz2',
        title: 'TypeScript Essentiel',
        description: 'Maîtrisez les concepts clés de TypeScript',
        level: 'Intermédiaire',
        ownerId: teacher?.id || 'teacher1',
        ownerName: teacher?.name || 'Pierre Teacher',
        questions: [
          {
            id: 'qts1',
            text: 'Quelle est l\'utilité de l\'interface en TypeScript ?',
            answers: [
              'Définir la structure d\'un objet',
              'Créer des classes',
              'Gérer les événements',
              'Faire des requêtes HTTP'
            ],
            correctIndex: 0,
            explanation: 'Les interfaces définissent des contrats de structure pour les objets.'
          },
          {
            id: 'qts2',
            text: 'Que signifie le "?" dans une propriété TypeScript ?',
            answers: [
              'La propriété est privée',
              'La propriété est optionnelle',
              'La propriété est statique',
              'La propriété est asynchrone'
            ],
            correctIndex: 1,
            explanation: 'Le "?" indique qu\'une propriété est optionnelle.'
          }
        ],
        createdAt: new Date()
      }
    ];

    this.saveQuizzes();
  }

  getAllQuizzes(): Quiz[] {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) return [];
    
    if (currentUser.role === 'admin') {
      return [...this.quizzes];
    } else if (currentUser.role === 'teacher') {
      return this.quizzes.filter(q => q.ownerId === currentUser.id);
    } else {
      return [...this.quizzes];
    }
  }

  getQuizById(id: string): Quiz | undefined {
    return this.quizzes.find(q => q.id === id);
  }

  createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt' | 'ownerName'>): Quiz {
    const currentUser = this.authService.getCurrentUser();
    
    const newQuiz: Quiz = {
      ...quiz,
      id: 'quiz_' + Date.now(),
      createdAt: new Date(),
      ownerName: currentUser?.name || 'Unknown'
    };
    
    this.quizzes.push(newQuiz);
    this.saveQuizzes();
    return newQuiz;
  }

  updateQuiz(id: string, updates: Partial<Quiz>): boolean {
    const index = this.quizzes.findIndex(q => q.id === id);
    if (index === -1) return false;
    
    this.quizzes[index] = { ...this.quizzes[index], ...updates };
    this.saveQuizzes();
    return true;
  }

  deleteQuiz(id: string): boolean {
    const initialLength = this.quizzes.length;
    this.quizzes = this.quizzes.filter(q => q.id !== id);
    this.saveQuizzes();
    return this.quizzes.length !== initialLength;
  }

  getQuizzesByOwner(ownerId: string): Quiz[] {
    return this.quizzes.filter(q => q.ownerId === ownerId);
  }

  searchQuizzes(searchTerm: string): Quiz[] {
    const term = searchTerm.toLowerCase();
    return this.getAllQuizzes().filter(q => 
      q.title.toLowerCase().includes(term) || 
      q.description.toLowerCase().includes(term)
    );
  }
}